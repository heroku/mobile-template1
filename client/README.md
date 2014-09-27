# Heroku sample mobile app, client portion

This directory contains the code for the Ionic framework+Angular app which constitutes the
client side of our mobile app.

The client app is a single-page web app served by the root 'index.html'. The Javascript
in the `js/` directory contains the Angular application which creates the app using
the html templates in `templates/'. Those templates use the Ionic framework to create the
basic mobile-ready UI components.


Template structure:

index.html
  -> templates/tabs-container.html
     -> templates/tabs-todos.html
     -> templates/tabs-