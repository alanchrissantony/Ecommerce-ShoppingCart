var express = require('express');
const { render, response } = require('../app');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs')
var fileupload=require('express-fileupload')
const productHelpers = require('../helpers/product-helpers');

   
var jsonParser = bodyParser.json();


/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelpers.getallproducts().then((products)=>{
    console.log(products)
    res.render('admin/view-products',{admin:true,products})
  })

  
});

router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})
})

router.post('/add-product',jsonParser,(req, res)=>{


  productHelpers.addproduct(req.body,(id)=>{

    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }
    })

    
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  productHelpers.deleteproduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})
router.get('/edit-product/:id',async(req,res)=>{
  let proId=req.params.id
  let product=await productHelpers.getproductdetials(proId)
  res.render('admin/edit-product',{product,admin:true})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateproduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

module.exports = router;
