<h1 align="center">ShoppingCart<h1/>

# Ecommerce-ShoppingCart


## Table of contents

- [Introduction](#introduction)
- [Demo](#demo)
- [Run](#run)
- [Technology](#technology)
- [Features](#features)
- [Database Models](#database)

## Introduction

A virtual ecommerce website using Node js, Express js, and Mongoose.

NOTE: Please read the RUN section before opening an issue.

## Demo

<p align="center">
<img src="https://imgur.com/63EKtfT.jpg"/>
<img src="https://imgur.com/IIYrNf8.jpg"/>
<img src="https://imgur.com/V2UvOoG.jpg"/>
<img src="https://imgur.com/VSnxsjR.jpg"/>
<img src="https://imgur.com/jsBgiqK.jpg"/>
</p>


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

The application displays a virtual store that contains virtual products.

Users can do the following:

- Create an account, login or logout
- Browse available products added by the admin
- Add products to the shopping cart, a user must be logged in
- Delete products from the shopping cart
- Display the shopping cart
- The profile contains all the orders a user has made

Admins can do the following:

- View all the information stored in the database. They can view/add/edit/delete orders, products and categories.

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
- category (ObjectId - a reference to the category)
- createdAt (Date)

### Cart:

- items: an array of objects, each object contains: <br>
  ~ productId (ObjectId - a reference to the product) <br>
  ~ qty (Number) <br>
  ~ price (Number) <br>
  ~ title (String) <br>
- totalQty (Number)
- totalCost (Number)
- user (ObjectId - a reference to the user)
- createdAt
  <br><br>
  
  
### Payment:
  
- Cash On Delivery
- Online Payment(Razorpay Payment Gateway)  
  

### Order:

- user (ObjectId - a reference to the user)
- cart (instead of a reference, we had to structure an object identical to the cart)
- address (String)
- paymentId (String)
- createdAt (Date)
- Delivered (Boolean)

  

[Alan Chriss Antony](https://github.com/alanchrissantony)
