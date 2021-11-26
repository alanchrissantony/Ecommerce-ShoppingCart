<h1 align="center">ShoppingCart<h1/>

# Ecommerce-ShoppingCart


## Table of contents

- [Introduction](#introduction)
- [Demo](#demo)
- [Run](#run)
- [Technology](#technology)
- [Features](#features)
- [Database Models](#database)
- [License](#license)

## Introduction

A virtual ecommerce website using Node js, Express js, and Mongoose.

NOTE: Please read the RUN section before opening an issue.

## Demo

![screenshot](screenshot.png)


The website resembles a real store and you can add products to your cart and pay for them. If you want to try the checkout process, you can use the dummy card number with any expiration date, CVC, and zip codes. Please <u><b>DO NOT</b></u> provide real card number and data.

In order to access the admin panel on "/admin"

## Run


- MONGO_URI: this is the connection string of your MongoDB database.

Now you can run "npm start" in the terminal and the application should work.

## Technology

The application is built with:

- Node.js version 12.16.3
- MongoDB version 4.2.0
- Express version 4.16.1
- Bootstrap version 4.4.1
- FontAwesome version 5.13.0


## Features

The application displays a virtual store that contains virtual products and contact information.

Users can do the following:

- Create an account, login or logout
- Browse available products added by the admin
- Add products to the shopping cart, a user must be logged in
- Delete products from the shopping cart
- Display the shopping cart
- Checkout information is processed using stripe and the payment is send to the admin
- The profile contains all the orders a user has made

Admins can do the following:

- Login or logout to the admin panel
- View all the information stored in the database. They can view/add/edit/delete orders, users, products and categories. The cart model cannot be modified by an admin because a cart is either modified by the logged in user before the purchase or deleted after the purchase.

## Database

All the models can be found in the models directory created using mongoose.

### User:

- username (String)
- password (String)


### Product:

- title (String)
- imagePath (String)
- description (String)
- price (Number)
- category (ObjectId - a reference to the category schema)
- createdAt (Date)

### Cart:

- items: an array of objects, each object contains: <br>
  ~ productId (ObjectId - a reference to the product schema) <br>
  ~ qty (Number) <br>
  ~ price (Number) <br>
  ~ title (String) <br>
  ~ productCode (Number) <br>
- totalQty (Number)
- totalCost (Number)
- user (ObjectId - a reference to the user schema)
- createdAt
  <br><br>
  \*\*The reason for including the title, price, and productCode again in the items object is AdminBro. If we are to write our own admin interface, we can remove them and instead populate a product field using the product id. However, AdminBro doesn't populate deep levels, so we had to repeat these fields in the items array in order to display them in the admin panel.

### Order:

- user (ObjectId - a reference to the user)
- cart (instead of a reference, we had to structure an object identical to the cart schema because of AdminBro, so we can display the cart's contents in the admin interface under each order)
- address (String)
- paymentId (String)
- createdAt (Date)
- Delivered (Boolean)


## License

[![License](https://img.shields.io/:License-MIT-blue.svg?style=flat-square)](http://badges.mit-license.org)

- MIT License
- Copyright 2021 © [Alan Chriss Antony](https://github.com/alanchrissantony)
