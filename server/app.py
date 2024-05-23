
from flask import jsonify, make_response, request, session
from models import User, Meditation, Session, MeditationCategory, Category
from flask_restful import  Resource
from sqlalchemy import desc

from config import app, db, api

@app.route('/users/<int:user_id>/sessions', methods=['GET'])
def get_user_sessions(user_id):
    sessions = Session.query.filter_by(user_id=user_id).all()
    sessions_data = [{
        'id': session.id,
        'title': session.title,
        'start_time': session.start_time.isoformat(),
        'end_time': session.end_time.isoformat()
    } for session in sessions]
    return jsonify(sessions_data)

# added this route for creating new sessions, not sure about it
@app.route('/sessions', methods=['POST'])
def create_session():
    # if 'user_id' not in session:
    #     return make_response({'error': 'Unauthorized'}, 403)
    
    data = request.get_json()
    new_session = Session(
        user_id=data['user_id'],
        meditation_id=data['meditation_id'],
        # created_at=data['created_at']
    )
    try:
        db.session.add(new_session)
        db.session.commit()
        return make_response(new_session.to_dict(), 201)
    except Exception as e:
        app.logger.error(f'Error creating session: {e}')
        db.session.rollback()
        return make_response({'error': str(e)}, 400)


# added this route for updating sessions
@app.route('/update_session/<int:id>', methods=['PATCH'])
def update_session(id):
    data = request.get_json()
    session = Session.query.get(id)
    if not session:
        return make_response({'error': 'Session not found'}, 404)
    
    try:
        for key, value in data.items():
            setattr(session, key, value)
        db.session.commit()
        return make_response(session.to_dict(), 200)
    except Exception as e:
        db.session.rollback()
        return make_response({'error': str(e)}, 400)

@app.route('/users', methods=['POST']) #sign up route
def manage_users():
        data = request.json
        new_user = User(username=data.get('username')) #create new user instance 
        new_user.password_hash = data.get('password')  # Set the password_hash using the setter
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id #set session hash to user id to keep logged in
        response = make_response(new_user.to_dict())
        response.set_cookie('user_id', str(new_user.id))
        return response, 201

@app.route('/logout', methods=["GET"])
def logout():
    session['user_id'] = None #clear session hash
    response = make_response({})
    response.delete_cookie('user_id')
    return response, 200

@app.route('/authenticate-session') #route for authentication 
def authorize():
    cookie_id = request.cookies.get('user_id')  
    if cookie_id:
        user = User.query.filter_by(id=cookie_id).first() #check to see if cookie matches current user id
        if user:
            return make_response(user.to_dict(only=['id', 'username'])), 200
    return make_response({'message': 'failed to authenticate'}), 401

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first() #check to see if username exists in db
    password = data.get('password')
    if user and user.authenticate(password): #check entered password against encrypted password in db 
        session['user_id'] = user.id 
        response = make_response(user.to_dict())
        response.set_cookie('user_id', str(user.id))
        return response, 200
    return jsonify({'message': 'Invalid username or password'}), 401


# route to get all meditations in db
class Meditations(Resource):
    def get(self):
        meditations = [meditation.to_dict() for meditation in Meditation.query.all()]
        
        return make_response(meditations)
    
api.add_resource(Meditations, '/meditations')

class MeditationsById(Resource):
    def get(self, id):
        meditation = Meditation.query.filter(Meditation.id==id).first()
        if meditation:
            return make_response(meditation.to_dict())
        else:
            return make_response({'error': 'Meditation not found'}, 404)
        
api.add_resource(MeditationsById, '/meditations/<int:id>')

#route to access user info and delete user 
class UsersById(Resource):
    def get(self, id):
        user = User.query.filter(User.id==id).first()
        if user:
            return make_response(user.to_dict())
        else:
            return make_response({'error': 'User not found'}, 404)
        
    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        else:
            try:
                for attr in request.json:
                    setattr(user, attr, request.json.get(attr))
                
                db.session.add(user)
                db.session.commit()

                return make_response(user.to_dict(), 202)
            except:
                return make_response({"errors": ["validation errors"]}, 400)
           
    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        else:
            db.session.delete(user)
            db.session.commit()

            return make_response({}, 204)

api.add_resource(UsersById, '/users/<int:id>')

# class Sessions(Resource):
#     def get(self):
#         sessions = [session.to_dict() for session in Session.query.all()]
#         return make_response(sessions)
    
#     def post(self):
#         data = request.get_json()
#         new_session = Session(
#             user_id = data.get('user_id'),
#             meditation_id = data.get('meditation_id'),
#             journal_entry=data.get('journal_entry'),
#             created_at=data.get('created_at')
#         )
#         db.session.add(new_session)
#         db.session.commit()
#         return make_response(new_session.to_dict(), 201)
    
# api.add_resource(Sessions, '/sessions')

class SessionsById(Resource):
    def get(self, id):
        session = Session.query.filter(Session.id == id).first()
        if session:
            return make_response(session.to_dict())
        else:
            return make_response({'error': 'Session not found'}, 404)
    def patch(self, id):
        session = Session.query.filter(Session.id == id).first()
        if not session:
            return make_response({'error': 'Session not found'}, 404)
        else:
            try:
                for attr in request.json:
                    setattr(session, attr, request.json.get(attr))
                db.session.add(session)
                db.session.commit()
                return make_response(session.to_dict(), 202)
            except:
                return make_response({'errors': ['validation errors']}, 400)
    def delete(self, id):
        session = Session.query.filter(Session.id == id).first()
        if not session:
            return make_response({'error': 'Session not found'}, 404)
        else: 
            db.session.delete(session)
            db.session.commit()
            
            return make_response({}, 204)
api.add_resource(SessionsById, '/sessions/<int:id>')
    
class CategoriesById(Resource):
    def get(self, id):
        category = Category.query.filter(Category.id == id).first()
        if category:
            return make_response(category.to_dict())
        else:
            return make_response({'error': 'Category not found'}, 404)
    def patch(self, id):
        category = Category.query.filter(Category.id == id).first()
        if not category:
            return make_response({"error": "Category not found"}, 404)
        else:
            try:
                category.name = request.json.get('name', category.name)
                db.session.add(category)
                db.session.commit()

                return make_response(category.to_dict(), 202)
            except:
                return make_response({"errors": ["validation errors"]}, 400)

    def delete(self, id):
        category = Category.query.filter(Category.id == id).first()
        if not category:
            return make_response({"error": "Category not found"}, 404)
        else:
            db.session.delete(category)
            db.session.commit()
            
            return make_response({}, 204)

api.add_resource(CategoriesById, '/categories/<int:id>')

class MeditationCategories(Resource):
    def get(self):
        meditation_categories = [mc.to_dict() for mc in MeditationCategory.query.all()]
        return make_response(meditation_categories)

    def post(self):
        data = request.get_json()
        new_mc = MeditationCategory(
            meditation_id=data.get('meditation_id'),
            category_id=data.get('category_id')
        )
        db.session.add(new_mc)
        db.session.commit()
        return make_response(new_mc.to_dict(), 201)

api.add_resource(MeditationCategories, '/meditation_categories')
        
        
if __name__ == '__main__':
    app.run(port=5555, debug=True)

