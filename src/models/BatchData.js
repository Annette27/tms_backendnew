const mongoose = require('mongoose');
// mongoose.connect("mongodb+srv://userone:userone@libraryfiles.o5pxy.mongodb.net/TRAINERMANGEMENT?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/TRAINERMANGEMENT')

const Schema = mongoose.Schema;
var BatchSchema = new Schema({
    course:String,
    name: String,
    courseid:String
 
});
var BatchData = mongoose.model('batch', BatchSchema);
module.exports = BatchData;