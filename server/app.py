from flask import jsonify, make_response, request, session
from models import User, Meditation, Session, Favorite
from flask_restful import  Resource
from sqlalchemy import desc
import ipdb
import json

from config import app, db, api

@app.route('/users/<int:user_id>/recent_session', methods=['GET'])
def get_recent_session(user_id):
    session = Session.query.filter_by(user_id=user_id).order_by(Session.created_at.desc()).first()
    if session:
        return jsonify(session.to_dict()), 200
    else:
        return jsonify({"error": "No recent session found"}), 404

@app.route('/users/<int:user_id>/sessions', methods=['GET'])
def get_user_sessions(user_id):
    sessions = [session.to_dict() for session in Session.query.filter_by(user_id=user_id).all()]
    
    return jsonify(sessions)

@app.route('/sessions', methods=['POST'])
def create_session():
    
    data = request.get_json()
    new_session = Session(
        user_id=data['user_id'],
        meditation_id=data['meditation_id'],
    )
    try:
        db.session.add(new_session)
        db.session.commit()
        return make_response(new_session.to_dict(), 201)
    except Exception as e:
        app.logger.error(f'Error creating session: {e}')
        db.session.rollback()
        return make_response({'error': str(e)}, 400)


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

@app.route('/authenticate-session', methods=['POST']) #route for authentication 
def authorize():
    cookie_id = request.cookies.get('user_id')  
    data = request.get_json()
    user_id = int(data.get('currentSession'))
    if user_id:
        user = User.query.filter_by(id=user_id).first() #check to see if user id exists in db
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
    return make_response({'message': 'Invalid username or password'}), 401

@app.route('/favorites', methods=['POST'])
def add_favorite():
    data = request.get_json()
    new_favorite = Favorite(
        user_id=data['user_id'],
        meditation_id=data['meditation_id']
    )
    try:
        db.session.add(new_favorite)
        db.session.commit()
        return make_response(new_favorite.to_dict(), 201)
    except Exception as e:
        db.session.rollback()
        return make_response({'error': str(e)}, 400)

@app.route('/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    favorites = [fav.to_dict() for fav in Favorite.query.filter_by(user_id=user_id).all()]
    return jsonify(favorites)

@app.route('/favorites/<int:user_id>/<int:meditation_id>', methods=['DELETE'])
def delete_favorite(user_id, meditation_id):
    favorite = Favorite.query.filter_by(user_id=user_id, meditation_id=meditation_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return make_response({'message': 'Favorite deleted successfully'}, 200)
    else:
        return make_response({'error': 'Favorite not found'}, 404)


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
        user = User.query.filter(User.id == id).first()
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
            except Exception as e:
                app.logger.error(f'Error updating user: {e}')
                return make_response({"errors": ["validation errors"]}, 400)
           
    def delete(self, id):
        # import ipdb; ipdb.set_trace()
        try:
            user = User.query.filter(User.id == id).first()
            if not user:
                return make_response({"error": "User not found"}, 404)
            db.session.delete(user)
            db.session.commit()
            return make_response({}, 204)
        except Exception as e:
            app.logger.error(f'Error deleting user: {e}')
            return make_response({"error": "An error occurred while deleting the user"}, 500)

api.add_resource(UsersById, '/users/<int:id>')


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
    
        
if __name__ == '__main__':
    app.run(port=5555, debug=True)


