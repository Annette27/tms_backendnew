const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://userone:userone@libraryfiles.o5pxy.mongodb.net/TRAINERMANGEMENT?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/TRAINERMANGEMENT')

const Schema = mongoose.Schema;
var NewApplSchema = new Schema({
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
    // password1:string
});
var NewApplData = mongoose.model('NewAppl', NewApplSchema);
module.exports = NewApplData;