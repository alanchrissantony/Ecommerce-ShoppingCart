var db=require('../config/connection')
var collection=require('../config/collection')
const { resolve, reject } = require('promise')
const bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
var Razorpay=require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_nD2lLN22mfadh7',
    key_secret: 'EZp5u2Rbp2qEFNDpy26a4bMq',
  });
const { response } = require('../app')

module.exports={


    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USERCOLLECTION).insertOne(userData).then((data)=>{
                resolve(data)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginstatus=false
            let response={}
            let user=await db.get().collection(collection.USERCOLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        response.user=user
                        response.status=true
                        resolve(response)
                    }
                    else{
                        resolve({status:false})
                    }
                })
            }
            else{
                resolve({status:false})
            }
        })
    },

    addToCart:(proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart= await db.get().collection(collection.CARTCOLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==proId)

                if(proExist!=-1){
                    db.get().collection(collection.CARTCOLLECTION).updateOne({user:objectId(userId),'products.item':objectId(proId)},
                    {
                        $inc:{'products.$.quantity':1}
                    }).then(()=>{
                        resolve()
                    })
                }
                else{
                    db.get().collection(collection.CARTCOLLECTION).updateOne({user:objectId(userId)},{
                        $push:{
                            products:proObj
                        }
                    }).then((response)=>{
                        resolve()
                    })
                }
            }else{
                let cartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CARTCOLLECTION).insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
                
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{

            let cartItems=await db.get().collection(collection.CARTCOLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCTCOLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
            ]).toArray()

            resolve(cartItems)
        })
    },

    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(collection.CARTCOLLECTION).findOne({user:objectId(userId)})
            if(cart){
                count=cart.products.length
            }
            resolve(count)
        })
    },

    changeProductQuantity:(detials)=>{
        detials.count=parseInt(detials.count)
        detials.quantity=parseInt(detials.quantity)
        return new Promise((resolve,reject)=>{

            if(detials.count==-1&&detials.quantity==1){
                db.get().collection(collection.CARTCOLLECTION).updateOne({_id:objectId(detials.cart)},
                {
                    $pull:{products:{item:objectId(detials.product)}}
                }).then((response)=>{
                    resolve({removeProduct:true})
                })
            }
            else{
                db.get().collection(collection.CARTCOLLECTION).updateOne({_id:objectId(detials.cart),'products.item':objectId(detials.product)},
                    {
                        $inc:{'products.$.quantity':detials.count}
                    }).then(()=>{
                        resolve({status:true})
                    })
            }
        })
    },
    removeCartProduct:(detials)=>{
        
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CARTCOLLECTION).updateOne({_id:objectId(detials.cart)},
                {
                    $pull:{products:{item:objectId(detials.product)}}
                }).then((response)=>{
                    resolve(true)
                })
        })
    },
    gettotalAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            
                try{
                    let total=await db.get().collection(collection.CARTCOLLECTION).aggregate([
                        {
                            $match:{user:objectId(userId)}
                        },
                        {
                            $unwind:'$products'
                        },
                        {
                            $project:{
                                item:'$products.item',
                                quantity:'$products.quantity'
                            }
                        },
                        {
                            $lookup:{
                                from:collection.PRODUCTCOLLECTION,
                                localField:'item',
                                foreignField:'_id',
                                as:'product'
                            }
                        },
                        {
                            $project:{
                                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                            }
                        },
                        {
                            $addFields:{
                                
                                quantity:'$quantity',
                                price: {$toInt:'$product.Price'}
                                
                            }
                        },
                        {
                            $project:{
                                
                                total:{$sum:{$multiply:['$quantity','$price']}}
                            }
                        }
                        
                    ]).toArray()
        
                    resolve(total[0].total)
                }
                catch{
                    total=0
                    resolve(total)
                }
            
            
        })
    },
    getProductList:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collection.CARTCOLLECTION).findOne({user:objectId(userId)})
            console.log(cart);
            resolve(cart.products)
            
        })
    },
    placeOrder:(order,products,total)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(order,products,total)
            let status=await order['Payment-method']=='COD'?'placed':'pending'
            let orderObj={
                deliveryDetails:{
                    address:order.Address,
                    pincode:order.Pincode,
                    mobile:order.Mobile,
                },
                userId:objectId(order.userId),
                PaymentMethod:order['Payment-method'],
                products:products,
                totalAmount:total,
                date:new Date,
                status:status
            }
            db.get().collection(collection.ORDERCOLLECTION).insertOne(orderObj).then((response)=>{
                db.get().collection(collection.CARTCOLLECTION).remove({user:objectId(order.userId)})
                console.log(orderObj._id)
                resolve(orderObj._id)
            })
        })
    },
    getUserOrders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDERCOLLECTION).find({userId:objectId(userId)}).toArray()
            resolve(orders)
        })
    },
    getOrderProducts:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems=await db.get().collection(collection.ORDERCOLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCTCOLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
            ]).toArray()
            console.log(orderItems)
            resolve(orderItems)
        })
    },
    generateRazorpay:(orderId,totalPrice)=>{
        return new Promise((resolve,reject)=>{
            
            var options = {
                amount: totalPrice,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId
              };
              instance.orders.create(options, function(err, order) {
                  if(response){
                      console.log(err)
                  }
                  else{
                    
                    resolve(order)
                  }
              });
        })
    },
    verifyPayment:(detials)=>{
        return new Promise((resolve,reject)=>{
            const crypto=require('crypto')
            let hmac=crypto.createHmac('sha256','EZp5u2Rbp2qEFNDpy26a4bMq')

            
            hmac.update(detials.payment.razorpay_payment_id + detials.payment.razorpay_order_id)
            hmac=hmac.digest('hex')
            if(hmac==detials.payment.razorpay_signature){
                resolve()
            }else{
                reject()
            }
        })
    },
    changePaymentStatus:(orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDERCOLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:{
                    status:'Placed'
                }
            }).then(()=>{
                resolve()
            })
        })
    }
}