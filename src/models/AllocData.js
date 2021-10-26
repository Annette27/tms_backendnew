const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://userone:userone@libraryfiles.o5pxy.mongodb.net/TRAINERMANGEMENT?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/TRAINERMANGEMENT')

const Schema = mongoose.Schema;
var AllocSchema = new Schema({
    name: String,
    email:String,
     phone:String,
     address:String,
     highestQualification:String,
     skillSet:String,
     companyName:String,
     designation:String,
     course:String,
    image:String,
    imagepath:String,
    id:String,
    password:String,
    // password1:string.,
    type:String,
    startdate:String,
    enddate:String,
    time:String,
    courseid:String,
    batch:String,
    venue:String
});
var AllocData = mongoose.model('AllocData', AllocSchema);
module.exports = AllocData;