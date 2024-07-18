const mongoClint=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    const url='mongodb+srv://alanchrissantony:EIBoBHCtrZBDaVGA@shoppingcart.qiubg9t.mongodb.net/?retryWrites=true&w=majority&appName=ShoppingCart'
    const dbname='ShoppingCart'

    mongoClint.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })
}

module.exports.get=function(){
    return state.db
}