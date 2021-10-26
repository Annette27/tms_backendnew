const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path"); 
//const multer = require("multer");
const jwt = require('jsonwebtoken');
const LoginData = require('./src/models/LoginData')
//const LoginRoutes = require('./routes/login');
const appRoutes = require('./routes/apps')
const trainersRoutes = require('./routes/trainers')
const coursesRoutes = require('./routes/courses')
const batchesRoutes = require('./routes/batches')
const allocationssRoutes= require('./routes/allocations')



// mongoose.connect("mongodb+srv://userone:userone@libraryfiles.o5pxy.mongodb.net/TRAINERMANGEMENT?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/TRAINERMANGEMENT')

const NewApplData =require('./src/models/NewAppl')
const CourseData = require('./src/models/CourseData')
const BatchData = require('./src/models/BatchData')
const AllocData= require('./src/models/AllocData')


var app = new express();
// app.use("/images", express.static(path.join("backend/images"))); 
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());

//app.use('/login',LoginRoutes);

username="admin@gmail.com"
password="Admin@123"

app.use('/applications',appRoutes)
app.use('/allocations',allocationssRoutes)
app.use('/trainers',trainersRoutes)
app.use('/courses',coursesRoutes)
app.use('/batches',batchesRoutes)

// var Storage=multer.diskStorage({
//     destination:"./public/images/",
//     filename:(req,file,cb)=>{
//         cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
//     }
// });
// var upload = multer({ 
//     storage:Storage
//  }).single('image')

// Verify token for admin
function verifyToken1(req,res,next){
    if(!req.headers.authorization){
      return res.status(401).send("unauthorised request")
    }
  let token = req.headers.authorization.split(' ')[1]
  if(token==null){
    return res.status(401).send("unauthorised request")
  }
  let payload=jwt.verify(token,'secretKey')
//   console.log(payload)
  if(!payload){
    return res.status(401).send("unauthorised request")
  }
  req.userId=payload.subject
  next()
  }
// Verifytoken for trainer
  function verifyToken2(req,res,next){
    if(!req.headers.authorization){
      return res.status(401).send("unauthorised request")
    }
  let token = req.headers.authorization.split(' ')[2]
  if(token==null){
    return res.status(401).send("unauthorised request")
  }
  let payload=jwt.verify(token,'secretKey')
//   console.log(payload)
  if(!payload){
    return res.status(401).send("unauthorised request")
  }
  req.userId=payload.subject
  next()
  }

app.post('/login',function(req,res){

    // res.header("Access-Control-Allow-Orgin","*") //FROM ANY SERVER WE GET THE "/products" REQUEST WE NEED TO ACCEPT IT
    // res.header("Acess-Conrol-Allow-Methods: GET,POST,PATCH,PUT,DELETE,OPTIONS");  //METHODS WE ARE ACCEPTING


    let userData=req.body

    if(username === userData.uname && password === userData.password){
        let payload = {subject:username+password}
        let token = jwt.sign(payload,'secretKey')
        res.status(200).send({token});
        // console.log("success")
        
  }
  else{
    LoginData.findOne({email:userData.uname})
    .then((data)=>{
        
        if(data==null){
        let error ="Invalid User";
        res.send({error})
        }
        else if(data.password===userData.password){
            let payload = {subject:userData.uname+userData.password}
            let token1 = jwt.sign(payload,'secretKey')
            // console.log(token1,data.name)
            res.status(200).send({token1,data});
            // console.log("success")
        }
    
    else{
        let error ="Invalid User";
        res.send({error})
        
    }
    
        })
    }
})
    
app.get('/:pro',  (req, res) => {
  
    const pro = req.params.pro;
      LoginData.findOne({"_id":pro})
      .then((data)=>{
          res.send(data);
      })
      })
 //   view many allocation
 app.get('/viewalloc/:pro',  (req, res) => {
  
    const pro = req.params.pro;
  
    AllocData.find({"id":pro})
      .then((data)=>{
          
          if(data!==null){
            let error="success"
            console.log(error)
            res.send({data,error});
          }
          else{
            let error ="No Allocations to view"
            console.log("error")
           res.send({data,error})
          }
          
      })
      .catch(()=>{
        let error ="error new"
        console.log(error)
      })
      })
    //   view many allocation

      app.put('/update',verifyToken2,(req,res)=>{
        // console.log(req.body)
        id=req.body._id
        names= req.body.name
        email = req.body.email
        phone = req.body.phone
        address = req.body.address
        highestQualification = req.body.highestQualification
        skillSet = req.body.skillSet
        companyName = req.body.companyName
        designation = req.body.designation
        course = req.body.course
        image = req.body.image
        imagepath = req.body.imagepath
       LoginData.findByIdAndUpdate({"_id":id},
                                    {$set:{"name":names,
                                    "email":email,
                                    "phone":phone,
                                    "address":address,
                                    "highestQualification":highestQualification,
                                "skillSet":skillSet,
                            "companyName":companyName,
                        "designation":designation,
                    "course":course,
                "image":image,
            "imagepath":imagepath}})
       .then(function(){
           res.send();
       })
      })






// delete Appl
app.delete('/remove/:id',verifyToken1,(req,res)=>{
    const id = req.params.id;
    NewApplData.findOne({"_id":id})
    .then((data)=>{
        trainer=
        {
            name: data.name,
            email: data.email,
            id: data.id,
            }
            NewApplData.findByIdAndDelete({"_id":id})
            .then(()=>{
                sendMailDecline(trainer).then((result)=>{
                    console.log("Email sent",result)
                res.send();
            
                })
                .catch((error)=>{
                    console.log(error.message)
                })
            })
    })

})


// delete course
app.delete('/delete/:id',verifyToken1,(req,res)=>{
    const id = req.params.id;
    BatchData.findOne({"_id":id})
    .then((data)=>{
            let course =data.course
            BatchData.findByIdAndDelete({"_id":id})
            .then((data)=>{
                AllocData.findOneAndDelete({"courseid":data.courseid})
                .then((data)=>{
                    sendMailDeleteAlloc(data).then((result)=>{
                        console.log("Email sent",result)
                    })
                    .catch((error)=>{
                        console.log(error.message)
                    })
                    res.send();

                   })
                // BatchData.findOne({"course":course})
                // .then((data)=>{
                //     if(data==null){
                //         CourseData.findOneAndRemove({"name":course})
                //         .then(()=>{
                //          res.send();

                //         })
                //     }
                //     else{
                // res.send();

                //     }
                // })
           })
        
    })

})

// delete allocation
app.delete('/deletealloc/:id',verifyToken1,(req,res)=>{
    const id = req.params.id;
    AllocData.findOne({"_id":id})
    .then((data)=>{
            if(data!==null){
                sendMailDeleteAlloc(data).then((result)=>{
                    console.log("Email sent",result)
                })
                .catch((error)=>{
                    console.log(error.message)
                })
                AllocData.findByIdAndRemove({"_id":id})
                .then((data)=>{

                    res.send();
                })
            }
        
    })

})

// delete allocation end



// Add course
app.post('/course',verifyToken1,(req,res)=>{
    const name=req.body.batch.course
    const batch = req.body.batch.name
    const courseid = req.body.batch.courseid

    CourseData.findOne({"name":req.body.batch.course})
    .then((data)=>{
        if(data==null){
            var course={
                name:req.body.batch.course,
                courseid:req.body.batch.courseid
             }
             var course = CourseData(course);
             course.save();
             // res.send();
              var batch = {
                 course:req.body.batch.course,
                 name:req.body.batch.name,
                courseid:req.body.batch.courseid
    
             }
             var batch = BatchData(batch);
             batch.save();
             let error ="Batch added"
    
             res.send({error});
        }
        else if(data.courseid==req.body.batch.courseid){
                           
                    BatchData.findOne({"name":req.body.batch.name})
                    .then((data)=>{
                        if(data==null){
                            var batch = {
                                               courseid:req.body.batch.courseid,
                                               course:req.body.batch.course,
                                               name:req.body.batch.name
                                           }
                                        //    console.log(batch)
                               
                                           var batch = BatchData(batch);
                                           batch.save();
                                           let error = "Batch added"
                               
                                           res.send({error});
                        }
                        else{
                            let error = "Batch already exixts"
                                    //    console.log(error)
                                       res.send({error});
                        }
                    })
                
                    } 
                   else{
                    let error = "Course ID incorrect"
                    //    console.log(error)
                       res.send({error});
                   }
        
    })
  
    
  })

// Add course end


// Approve trainer new
app.post('/trainer',verifyToken1,(req,res)=>{
    LoginData.findOne().sort({id:-1})
    .then((data)=>{
        if (data!==null){
            let idnew = data.id;
            var num=   idnew.slice(-2)
            let  id1=parseInt(num);
            id2= id1 + 1
            if(id2<10){
            id2= `0`+`${id2}`
            }
             idq=`TR`+`${id2}`
     //   console.log(idq+ "first")
       const id=req.body.trainer._id
       
       trainer=
           {
               name: req.body.trainer.name,
               email: req.body.trainer.email,
               phone: req.body.trainer.phone,
               address: req.body.trainer.address,
               highestQualification: req.body.trainer.highestQualification,
               skillSet: req.body.trainer.skillSet,
               companyName: req.body.trainer.companyName,
               designation: req.body.trainer.designation,
               course: req.body.trainer.course,
               id: idq,
               password: req.body.trainer.password,
               image: req.body.trainer.image,
               imagepath: req.body.trainer.imagepath,
               type:req.body.trainer.type
   
           }
         //   console.log(trainer.id+"third")
           sendMail(trainer).then((result)=>{
               console.log("Email sent",result)
           })
           .catch((error)=>{
               console.log(error.message)
           })
       var trainer = LoginData(trainer);
       trainer.save();
       NewApplData.findByIdAndDelete({"_id":id})
       .then(()=>{
      
       res.send();
   })}
        else{
            idq="TR01"
            const id=req.body.trainer._id
           
            trainer=
                {
                    name: req.body.trainer.name,
                    email: req.body.trainer.email,
                    phone: req.body.trainer.phone,
                    address: req.body.trainer.address,
                    highestQualification: req.body.trainer.highestQualification,
                    skillSet: req.body.trainer.skillSet,
                    companyName: req.body.trainer.companyName,
                    designation: req.body.trainer.designation,
                    course: req.body.trainer.course,
                    id: idq,
                    password: req.body.trainer.password,
                    image: req.body.trainer.image,
                    imagepath: req.body.trainer.imagepath,
                    type:req.body.trainer.type
        
                }
              //   console.log(trainer.id+"third")
                sendMail(trainer).then((result)=>{
                    console.log("Email sent",result)
                })
                .catch((error)=>{
                    console.log(error.message)
                })
            var trainer = LoginData(trainer);
            trainer.save();
            NewApplData.findByIdAndDelete({"_id":id})
            .then(()=>{
           
            res.send();
        })
        }
       
    })
    .catch((error)=>{
      
       console.log(error)
        
    })
    
     
  })


// Approve trainer new end

//  app.get('/id',function(req,res){
//     LoginData.findOne().sort({id:-1})
//      .then((data)=>{
//         if(data.id){
//           let idnew = data.id;
//             var num=   idnew.slice(-2)
//             let  id1=parseInt(num);
//             id2= id1 + 1
//             if(id2<10){
//             id2= `0`+`${id2}`
//             }
//             let id=`TR`+`${id2}`
       
//             res.send({id})
//           }
         
//      })
//      .catch(()=>{
//         id="TR01"
//         res.send({id}) 
//      })
     
   
  
//  })



// sign up of new applicants
app.post('/newappl',function(req,res){
   
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
     NewAppl=
        {
            name: req.body.trainer.name,
            email: req.body.trainer.email,
            phone: req.body.trainer.phone,
            address: req.body.trainer.address,
            highestQualification: req.body.trainer.highestQualification,
            skillSet: req.body.trainer.skillSet,
            companyName: req.body.trainer.companyName,
            designation: req.body.trainer.designation,
            course: req.body.trainer.course,
            id: req.body.trainer.id,
            password: req.body.trainer.password,
            image: req.body.trainer.image,
            imagepath: req.body.trainer.imagepath
        }
        let trainerData = req.body  
        var trainer = {
                 
            email:req.body.trainer.email,
                      
           }   
        //    checking with admins mail id
        if(username === trainer.email){
            let error ="User Already exists";
           
            res.send({error})
            
        }
        // checking in database of new applicants
        else{
            LoginData.findOne({email: trainer.email})
            .then((data)=>{
                if(data==null){
                    NewApplData.findOne({email: trainer.email})  
                    .then((data)=>{
                        
                        if(data==null){
                            var newAppl = new NewApplData( NewAppl);
                            newAppl.save();
                                let error ="new User";
                                res.status(200).send({error});
                        }
                        else{
                        
                            let error ="Already applied";
                             res.send({error}) 
                        }
                        
                    })
                }
                else{
                    let error ="User Already exists";
                       
                    res.send({error}) 
                }
            })

         
      
    }

  
});
// neww allocation
app.post('/newalloc',verifyToken1,function(req,res){
   
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
     NewAlloc=
        {
            name: req.body.allocate.name,
            email: req.body.allocate.email,
            phone: req.body.allocate.phone,
            address: req.body.allocate.address,
            highestQualification: req.body.allocate.highestQualification,
            skillSet: req.body.allocate.skillSet,
            companyName: req.body.allocate.companyName,
            designation: req.body.allocate.designation,
            course: req.body.allocate.course,
            id: req.body.allocate.id,
            password: req.body.allocate.password,
            image: req.body.allocate.image,
            imagepath: req.body.allocate.imagepath,
            type:req.body.allocate.type,
            startdate:req.body.allocate.startdate,
            enddate:req.body.allocate.enddate,
            time:req.body.allocate.time,
            courseid:req.body.allocate.courseid,
            batch:req.body.allocate.batch,
            venue:req.body.allocate.venue
        }
     
           AllocData.findOne({id:NewAlloc.id})
           .then((data)=>{
               if(data==null){
                AllocData.findOne({batch:NewAlloc.batch})
                .then((data)=>{
                    if(data==null){
                        var newAlloc = new AllocData( NewAlloc);
                        newAlloc.save();
                        sendMailAllocation(NewAlloc).then((result)=>{
                            console.log("Email sent",result)
                        })
                        .catch((error)=>{
                            console.log(error.message)
                        })
                                let error ="new allocation";
                                res.status(200).send({error});
                    }
                    else{
                        let error ="batch allocated to another trainer";
                             res.send({error})
                    }
                })
               }
               else{
                  
                   enddate= new Date(data.enddate)
                   startdate=new Date (NewAlloc.startdate)
                    const diffTime = Math.floor(startdate - enddate)
                   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                   console.log(diffDays)
                   if(diffDays>0){
                    var newAlloc = new AllocData( NewAlloc);
                    newAlloc.save();
                    sendMailAllocation(NewAlloc).then((result)=>{
                        console.log("Email sent",result)
                    })
                    .catch((error)=>{
                        console.log(error.message)
                    })
                            let error ="new allocation";
                            res.status(200).send({error});
                   }
                   else{
                    let error ="Trainer already allocated a batch";
                    res.send({error})
                   }
                
               }

           })
         
});
// new allocation end


const nodemailer = require('nodemailer')
const {google} = require('googleapis')

const CLIENT_ID = '417983538193-ohi6nlpv12lojr4camd5r8dt0lpbfc8d.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04ufjceILNcF0CgYIARAAGAQSNwF-L9IrfMrWs2xE1LsQClS9snO5EwfZOcZdMYLmF-uLfFjCMTF6sT5HO29UbD79IO3XITxMxEk'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})


async function sendMail(trainer){
try{
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({

        service:'gmail',
        auth:{
            type:'OAuth2',
            user:'sreeprasanth863@gmail.com',
            clientId:CLIENT_ID,
            clientSecret:CLIENT_SECRET,
            refreshToken:REFRESH_TOKEN,
            accessToken:accessToken
        }
    })

     mailOptions = {
        from:'sreeprasanth863@gmail.com',
        to:trainer.email,
        subject:'Sucessfull Enrollment in ICTAK as Trainer',
        text: 'Type of employment is '+ trainer.type + '. Your ID is ' + trainer.id +'. You can login using the email id and password used for signup.'

    }
const result = await transport.sendMail(mailOptions)
return result
}
catch(error){
return error
}
}
async function sendMailAllocation(NewAlloc){
    try{
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
    
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:'sreeprasanth863@gmail.com',
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken:accessToken
            }
        })
    
         mailOptions = {
            from:'sreeprasanth863@gmail.com',
            to:NewAlloc.email,
            subject:'Batch Allocation details',
            text: 'Your batch allocation details is as follows  '+
            ' Course: '+NewAlloc.course+
            '  Course Id: '+NewAlloc.courseid+
            ' batch: '+ NewAlloc.batch+
            ' start date: '+ NewAlloc.startdate+
            ' end date: '+ NewAlloc.enddate+
            ' time: '+NewAlloc.time+
            ' venue: '+NewAlloc.venue
            
    
        }
    const result = await transport.sendMail(mailOptions)
    return result
    }
    catch(error){
    return error
    }
    }
    async function sendMailDeleteAlloc(data){
        try{
            const accessToken = await oAuth2Client.getAccessToken()
            const transport = nodemailer.createTransport({
        
                service:'gmail',
                auth:{
                    type:'OAuth2',
                    user:'sreeprasanth863@gmail.com',
                    clientId:CLIENT_ID,
                    clientSecret:CLIENT_SECRET,
                    refreshToken:REFRESH_TOKEN,
                    accessToken:accessToken
                }
            })
        
             mailOptions = {
                from:'sreeprasanth863@gmail.com',
                to:data.email,
                subject:'Batch Allocation Change',
                text: 'There is a change in the sheduled Batch allocation.New allocatio will be initimated to you soon'
                
        
            }
        const result = await transport.sendMail(mailOptions)
        return result
        }
        catch(error){
        return error
        }
        }
async function sendMailDecline(trainer){
    try{
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
    
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:'sreeprasanth863@gmail.com',
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken:accessToken
            }
        })
    
         mailOptions = {
            from:'sreeprasanth863@gmail.com',
            to:trainer.email,
            subject:'Your Application for trainer enrollment in ICTAK is declined',
            text: 'Sorry your application has been rejected.'
    
        }
    const result = await transport.sendMail(mailOptions)
    return result
    }
    catch(error){
    return error
    }
    }

app.listen(3000,()=>{
    console.log(`Listening to port 3000`)
})