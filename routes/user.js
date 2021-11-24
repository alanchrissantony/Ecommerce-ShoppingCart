const { response } = require('express');
var express = require('express');
const { Db } = require('mongodb');
const { resolve } = require('promise');
var router = express.Router();
var Razorpay=require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_nD2lLN22mfadh7',
    key_secret: 'EZp5u2Rbp2qEFNDpy26a4bMq',
  });
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helper')
const script=require('../public/javascripts/script')
const { options } = require('./admin');

const verifylogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',async function(req, res, next) {

  let user=req.session.user
  let cartCount=null
  if(req.session.user){
    cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getallproducts().then((products)=>{

    res.render('index',{products,user,cartCount})
  })


});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
    res.render('user/login',{'loginErr':req.session.loginErr})
    req.session.loginErr=false
  }

});
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{

    res.redirect('/login')
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }
    else{
      req.session.loginErr='Invalid username or password'
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifylogin,async(req,res)=>{
  let products=await userHelpers.getCartProducts(req.session.user._id)
  let total=await userHelpers.gettotalAmount(req.session.user._id)
 
  res.render('user/cart',{products,user:req.session.user,total})
})
router.get('/add-to-cart/:id',(req,res)=>{
  if(req.session.user){
    userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    
    })
    res.json({status:true})
  }
  else{
    res.json(false)
  }
})
router.post('/remove-product',(req,res,next)=>{
  console.log(req.body)
  userHelpers.removeCartProduct(req.body).then((response)=>{
    res.json(response)
  })


})
router.post('/change-product-quantity',(req,res,next)=>{

  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total=await userHelpers.gettotalAmount(req.body.user)
    res.json(response)
  })
})
router.get('/place-order',verifylogin,async(req,res)=>{
  
  let total= await userHelpers.gettotalAmount(req.session.user._id )
  let userId=req.session.user._id
  

  res.render('user/place-order',{total,user:req.session.user})
})
router.post('/place-order',async(req,res)=>{
  let orders=await userHelpers.getUserOrders(req.session.user._id)
  let products=await userHelpers.getProductList(req.body.userId)
  let totalPrice=await userHelpers.gettotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['Payment-method']=='COD'){
      //res.render('user/order',{user:req.session.user,orders})
      res.json({COD:true})
    }
    else{
      userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
      res.json(response)
      })
    }
  })
})
router.get('/order',verifylogin,async(req,res)=>{
  let orders=await userHelpers.getUserOrders(req.session.user._id)
  res.render('user/order',{user:req.session.user,orders})
})
router.get('/view-order-products/:id',verifylogin,async(req,res)=>{
  let products=await userHelpers.getOrderProducts(req.params.id)
  res.render('user/view-order-products',{user:req.session.user,products})
})
router.post('/verify-payment',(req,res)=>{
 console.log(req.body)
 userHelpers.verifyPayment(req.body).then(()=>{
   userHelpers.changePaymentStatus(req.body.order.id).then(()=>{
     res.json({status:true})
   })
 }).catch((err)=>{
   res.json(false)
 })
})

module.exports = router;
