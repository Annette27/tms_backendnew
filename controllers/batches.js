const BatchData = require('../src/models/BatchData')


const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://userone:userone@libraryfiles.o5pxy.mongodb.net/TRAINERMANGEMENT?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/TRAINERMANGEMENT')


exports.getBatches= async(req,res)=>{
    const batches = await BatchData.find();
    // console.log(books)
    res.status(200).json({batches})
}