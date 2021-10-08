const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const validator = require("validator")
const https = require('https')

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/task3',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

const userSchema = new mongoose.Schema(
    {
        _id: String,
        first_name: {
            type: String,
            required: true,
            unique: true,
            minlength: [2, "minimum 2 letters"],
            maxlength: 30
        },
        last_name: {
            type: String,
            required: true,
            unique: true,
            minlength: [2, "minimum 2 letters"],
            maxlength: 30
        },
        email: {type: String,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Email.not valid")
                }
            }
        },
        pwd: {type: String,
            minlength: 10,
            maxlength:30
        },

        address: {
            type: String,
            required: true,
            unique: true,
            minlength: [2, "minimum 2 letters"],
            maxlength: 30
        },
        city: String,
        state: String,
        zip: {type: Number,
            min: 4,
            max: 4
        },
        phone:{type: Number,
            min: 10,
            max: 10
        }
    }
)

const User = new mongoose.model("User", userSchema)
const user = new User({
        first_name: "first_name",
        last_name: "last_name",
        email : "email",
        pwd: "pwd",
        address: "address",
        city: "city",
        state: "state",
        zip: "zip",
        phone: "phone"
})

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.post("/sign_up",(req,res)=>{

    
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var phone_number = req.body.phone_number;
    const data = {
        members:[{
            email_address: email,
            status : "subscribed",
            merge_fields:{
                FNAME: first_name,
                LNAME:last_name
            }
        }]
    }
    jsonData = JSON.stringify(data)    
    const url ="https://us5.api.mailchimp.com/3.0/lists/3cede4469a"

    const options={
        method:"POST",
        auth:"shu:0730a4f3891e4af9daab84e315837efd-us5"
    }

    const request = https.request(url, options, (response)=>{
            response.on("data", (data)=> {
            console.log(JSON.parse(data))
        })

    })

    request.write(jsonData)
    request.end()
    console.log(first_name,last_name,email)

    

})


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000);


console.log("Listening on PORT 3000")