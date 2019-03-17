const express = require("express");
const app = express();
var mongoose = require("mongoose");
var User = require(__dirname + "/app/userModel");
var nev = require("email-verification")(mongoose);


//configure code to come

nev.generateTempUserModel(User);
var TempUser = require(__dirname + "/app/tempUserModel");
nev.configure(
    {
        tempUserModel: TempUser
    }, 
    (error, options) => {}
);

var email = "vedanta32000@gmail.com";
var password = "dragonelis";

var newuser = User(
    {
        userId: Default1,
        email: email,
        password: password
    }
)

nev.createTempUser(newuser, (err, existingPersistentUser, newTempUser)=>
    {
        if(err){console.log("error in creating temp user.");}
        if(existingPersistentUser){console.log("already existing user.");}
        else
        {
            console.log("user created successfully.");
            var URL = newTempUser[nev.options.URLFieldName];
            nev.sendVerificationEmail
            (
                email, URL, function(err, info)
                {
                    if(err){console.log("Error in sending Verification mail")}
                    else{console.log("verification Mails sent !!!")}
                }
            )
        }
    }
)

//commented hashing code
/* 
var myHasher = function(password, tempUserData, insertTempUser, callback) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return insertTempUser(hash, tempUserData, callback);
  };
   
  // async version of hashing function
  myHasher = function(password, tempUserData, insertTempUser, callback) {
    bcrypt.genSalt(8, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        return insertTempUser(hash, tempUserData, callback);
      });
    });
  };
*/

var url = '   ';
nev.confirmTempUser(url, function(err, user)
    {
        if(err)
        {
            console.log("error in confirming new user.");
        }
        else{
            console.log("new user succesfully created.");
        }
    }
)