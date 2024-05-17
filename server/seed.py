#!/usr/bin/env python3
from random import randint, choice as rc
from faker import Faker
from app import app
from models import db, User, Meditation, Session, Category, MeditationCategory
import json
from os.path import join, dirname


# if __name__ == '__main__':
#     fake = Faker()
#     with app.app_context():
#         print("Starting seed...")
#         # Seed code goes here!

# def seed_users(num_users=3):
#     fake = Faker()
#     with app.app_context():
#         print("Seeding users...")
#         for _ in range(num_users):
#             username = fake.user_name()
#             password = 'password123'  # Replace with your desired default password
#             user = User(username=username)
#             user.password_hash = password
#             db.session.add(user)
#         db.session.commit()
#         print(f"{num_users} fake users created!")

# if __name__ == '__main__':
#     seed_users()

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