# Heroku template mobile app `Quiz Live`

This sample application implements a simple "live quiz" mobile game. The mobile
app itself is a hybrid AngularJS app composed of HTML, CSS and Javascript. The
server side is implemented as an Express Node.js application running on top of 
a Postgres database.

This application should serve as a good base for creating mobile apps to deploy on
Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## How to play

A set of players opens the app on their phones and registers to play. The app maintains 
this list of users plus a set of quiz questions. During the game, questions
are presented to each user running the app, and points are awarded for correct answers
to questions. As players earn points a realtime leaderboard is displayed to each
player.

Notification of new questions and answer results are broadcast via Websocket to the
mobile app using the SocketIO library.

## Architecture

The app has two major pieces: An AngularJS based client app which comprises the front-end
which runs on the phone, and a Node.js backend which provides an API to the client app for 
user registration, data storage, and event broadcast.

    /---mobile app-----\
    | Ionic framework  |
    | Angular JS       |
    \------------------/
           |
           | http / websocket
           |
    /-------Node.js app-\
    |                   |
    | express           |
    |   bookshelf       |
    |      node-pg      |
    \-------------------/
           |
       [Postgres DB]

## Deployment

The app can be deployed to Heroku, and distributed to the mobile device either through
the mobile web browser, or by compiling the AngularJS application into a native app
using an Apach Cordova container.

## Installation and setup

Clone this repo to your local machine and install the requirements:

    npm install

Now create a database on your local server called
`quizlive`. Now create the database schema and initial data:

    ./bootstrap.sh

And now run the server app:

    node server.js

and open the client app:

    http://localhost:5000

## Deploy to Heroku

When you are ready to share the app, just create a new Heroku app, provision a Postgres
database addon for your app, and then deploy the code.

# Understanding the code

The components of the application are organized as follows:

| component | folder |
|------------|---------|
| client app | client |
| ..app code | client/js |
| ..html templates | client/templates |
| ..ionic/angular frameworks | client/lib | 
|            |        |
| express app | server.js, server/* |
| ..db migrations | server/migrations |    
| ..question list | server/load_question.js |
| admin app  | admin  |




