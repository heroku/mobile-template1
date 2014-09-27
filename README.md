# Heroku template mobile app `Muchado`

This sample application implements a basic To Do list mobile application. The mobile
app itself is a hybrid Angular JS app composed from HTML, CSS and Javascript. The
server side is composed of a Node.js application running on top of a Postgres database.

This application should serve as a good base for creating mobile apps to deploy on
Heroku.

## The app

Our sample app is pretty simple. It supports a simple email / password registration
and login system. Then users can create, mark off, and delete To Do items in the
app. 

A user can invite another user to view shared to do items. When they create a To Do
item they can elect to create a 'Shared' to do, in which case the item will appear
on the 'Shared To Dos' list of both users.

## Architecture

The app has two major pieces: An AngularJS based client app which comprises the front-end
which runs on the phone, and a Node.js backend which provides an API to
the client app for user authentication and data storage.

## Authentication

