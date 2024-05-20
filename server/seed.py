#!/usr/bin/env python3
from random import randint, choice as rc
from faker import Faker
from app import app
from models import db, User, Meditation, Session, Category, MeditationCategory
import json
from os.path import join, dirname

fake = Faker()


def create_meditations():
    file_path = join(dirname(__file__), '../client/src/assets/Meditations.json')
    
    with open(file_path, 'r') as file:
        data = json.load(file)
        
    for meditation_data in data:
        meditation = Meditation(
            meditation_name=meditation_data['title'],
            description=meditation_data['description'],
            audio_url=meditation_data['audio_url'],
            duration=meditation_data['duration'],
            # image=meditation_data['image']
        )
        
        db.session.add(meditation)

    # Commit the changes to the database
    db.session.commit()
    
# def create_users(num_users):
#     users = []
#     for _ in range(num_users):
#         username = fake.email()
#         password = fake.password()
#         user = User(username=username)
#         user.password_hash = password
#         users.append(user)
#     db.session.add_all(users)
#     db.session.commit()

def seed_users(num_users=3):
    fake = Faker()
    with app.app_context():
        print("Seeding users...")
        users = []
        for _ in range(num_users):
            username = fake.user_name()
            password = 'password123'
            user = User(username=username)
            user.password_hash = password
            users.append(user)
        db.session.add_all(users)
        db.session.commit()
        print(f"{num_users} fake users created!")

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_users()
        create_meditations()