const express = require("express");
const app = express();
const port = 3000;
app.set("view engine","ejs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const dotenv = require('dotenv').config();

//Setting up the server for listening
const server = app.listen(port, () => console.log("Listening on Port 3000."));

app.set("view engine", 'ejs');

//Chat soket.io
const socket = require('socket.io');

//For Chat

var io = socket(server);

io.on('connection',function(socket){
    console.log("SOCKET HAS BEEN MADE");
    socket.on('chat',function(data){
        io.sockets.emit('chat',data);
    });
});

//dB file
var A = require("./models/modelA.js");
var B = require("./models/modelB.js");
var Atemp = require("./models/modelAtemp.js");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//mongoose server
mongoose.connect('mongodb://localhost:27017/ideacode', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});



//init static
app.use(express.static("public"));



                                /* --------------------------   A user  -----------------------------*/
app.get("/loginAuser", (req, resp)=> 
    resp.sendFile(__dirname + "/public/html/loginAuser.html")
)

app.post("/loginAuser", (req, resp) => 
    {
        var user = req.body.userId;
        var password_ = req.body.password;
        A.findOne({userId: user, password: password_}, (err, data)=> 
        {
            if(err)
            {console.log(err, "Error occured while finding the data.");}
        

                console.log(data.userId);
                console.log(data.password);
                resp.render("userAdashboard.ejs", {data: data})
            
        })
    }
)

//Chat Router
app.get('/chat',function(req,res){
    res.sendFile(__dirname+"/public/html/chat.html");

});



app.get("/signup", (req, resp)=>
    {
        resp.sendFile(__dirname + "/public/html/signup.html");
    }
)

app.post(
"/signup", (req, resp)=>
    {
        var emailId = req.body.emailId;
        var userId = req.body.userId;
        var password = req.body.password;
        var newTemUser = new Atemp
        (
            {
                userId: userId,
                emailId:  emailId,
                password: password,
            }
        )
        newTemUser.save();
        resp.send("Your Request Has been Delivered to the admin.");
    }
)


                                /* --------------------------   admin   -----------------------------*/
app.get("/admin", (req, resp)=> 
    {
        resp.sendFile(__dirname + "/public/html/adminsignin.html");
    }
) 

var confirmationURLs = [];
app.post("/admin", (req, resp)=> 
    {
        var admin = req.body.admin;
        var password = req.body.password;
        if(admin == process.env.ADMIN && password == process.env.PASSWORD)
        {
            Atemp.find({}, function(err, person){if(err){console.log(err);}else{
                console.log(person);
                function confirmation(user){
                    var newUser = new A(
                        {
                            userId: user.userId ,
                            emailId: user.emailId ,
                            password: user.password,
                            connectedB: [] 
                        }
                    )
                    newUser.save();
                    Atemp.deleteOne({userId: user.userId, emailId: user.emailId, password: user.password}, (err)=>{console.log(err)});
                 }
                resp.render("adminDashBoard", {person: person, confirmation: confirmation});
    
        }});
            //console.log(tempData.emailId);
            
            //resp.send("Done");
        }
        else
        {
            resp.redirect("/admin");
        }
    }
)


                            /* --------------------------   B user  -----------------------------*/
app.get("/loginBuser", (req, resp)=> 
    resp.sendFile(__dirname + "/views/loginB.html")
)

app.post("/loginBuser", (req, resp) => 
    {
        var user = req.body.userId;
        var password_ = req.body.password;
        B.findOne({userId: user, password: password_}, (err, data)=> 
        {
            if(err)
            {console.log(err, "Error occured while finding the data.");}
            else
            {
                console.log(data.userId);
                console.log(data.password);
                //Render these values into ejs file.
            }
        })
    }
)






