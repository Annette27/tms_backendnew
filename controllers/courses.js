const CourseData = require('../src/models/CourseData')


const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://userone:userone@libraryfiles.o5pxy.mongodb.net/TRAINERMANGEMENT?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/TRAINERMANGEMENT')


exports.getCourses= async(req,res)=>{
    const courses = await CourseData.find();
    // console.log(books)
    res.status(200).json({courses})
}