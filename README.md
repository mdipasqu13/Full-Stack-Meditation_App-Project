# Getting Started

Make sure you are in your root directory. Begin by navigating to server directory and run the following commands:
    
    cd server 
    
    pipenv install
    
    pipenv shell
   
    flask db upgrade head
    
    python seed.py

Navigate to client directory and run the following commands:
    
    cd client
   
    npm install
    
    npm install --legacy-peer-deps

Finally, get your backend and frontend running. Navigate to the server directory and run the following command:

    cd server

    python app.py 

Then, in a new terminal, navigate to the client directory and run the following command:

    cd client

    npm run dev


# Calm-Space

A meditation platform that provides users a variety of filterable audio backgrounds and guided options for meditating, encourages users to practice regularly by recording their use history, and allows users to interact with the platform through journaling to record their thoughts and feedback about their sessions. 

## Core Features

* List of meditation audio options: A comprehensive database of audio background options that users can browse and choose from. 
* Filterable: Users can filter through audio options based on tag, category and duration, etc. 
* User Login: Secure login funcitonality for personalized user experience. 
* Calendar Feature: users can see and access their previous sessions stored in database. 
* Journal Feature: users can record their thoughts after each session, view, edit and delete them. 

## Advanced Features (Stretch Goals)

* Users will be encouraged to practice consistently by earning "streaks".
* Users will be able to schedule sessions in advance for themselves utilizing reminders.
* Users will be able to favorite audio files or combinations of audio background and duration for future sessions easy access. 
* Most played audio suggestions feature on home page for easy access.
* Track mood over time by recording mood each day
* Daily inspirational mantra on homepage

## Wireframe

<img src="Planning/homepage.png" alt="homepage"/>
<img src="Planning/MeditationsPage.png" alt="meditations_page"/>
<img src="Planning/CalendarPage.png" alt="calendar_page"/>
<img src="Planning/SignInPage.png" alt="login_page"/>
<img src="Planning/ProfilePage.png" alt="profile_page">

## React Routes

<img src="Planning/ReactRoutes.png" alt="routes"/>

## React Component Tree

<img src="Planning/ComponentTree.png" alt="component-tree"/>

## Database Schema

<img src="Planning/Schema.png" alt="schema"/>

## API Routes

<img src="Planning/API Routes.png" alt="api_routes"/>

## Trello

https://trello.com/b/9Db4wvOf/meditationapp
<img src="Planning/kanban_board.png" alt="kanban_board"/>