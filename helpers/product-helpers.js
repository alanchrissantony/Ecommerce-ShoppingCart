var db=require('../config/connection')
var collection=require('../config/collection')
const { resolve, reject } = require('promise')
var objectId=require('mongodb').ObjectId
const { response } = require('../app')

module.exports={

    addproduct:(product,callback)=>{
        

        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },

    getallproducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCTCOLLECTION).find().toArray()
            resolve(products)
        })
    },

    deleteproduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCTCOLLECTION).remove({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },

    getproductdetials:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCTCOLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateproduct:(proId,prodetials)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCTCOLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Product:prodetials.Product,
                    Price:prodetials.Price,
                    Category:prodetials.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}