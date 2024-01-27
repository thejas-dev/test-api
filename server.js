const express = require('express');
const app = express();
const cors = require('cors');
var jwt = require("jsonwebtoken");


app.use(cors());
app.use(express.json());

let data = {
    'Ramesh':['BMW','Audi','Suzuki','TATA'],
    'Suresh':['BMW','Audi'],
    'Vignesh':['Suzuki','TATA'],
    'Harish':['Tesla','Thar'],
};

let users = {
    'thejas@gmail.com':'1234'
}

console.log('Ramesh Owned Cars: ', data.Ramesh);

function middleware(req,res,next){
    if(req.body.token === 'abcdef'){
        next()
    }else{
        res.json("Auth Failed!")
    }
}

app.post('/loginUser',(req,res)=>{
    const bodyData = req.body;
    console.log(bodyData)
    if(users[bodyData.email] === bodyData.password){
        const response = {
            status:true,
            token:jwt.sign({
                credentials: {
                    email:bodyData.email,
                    password:bodyData.password
                }
            }, 'this_is_secret', {
                expiresIn: 86400
            })
        }
        res.send(response);
    }else{
        const response = {
            status:false
        }
        res.send(response)
    }
})

app.put('/updateCars',middleware,(req,res)=>{
    const bodyData = req.body;
    if(data[bodyData.name] && bodyData.cars.length > 0){
        data[bodyData.name] = bodyData.cars;
        const response = {
            status:true
        }
        res.send(response)
    }else{
        res.json("Data is not present or cars are not passed in request, have you forgot to create it?")
    }
})

app.delete('/deleteCars/:name',(req,res)=>{
    const paramsData = req.params;
    delete data[paramsData.name];
    const response = {
        status:true,
    }
    res.status(200);
    res.send(response);

})

app.all('/createCars',(req,res,next)=>{
    const resultOfVerify = (err,decode) => {
        if(!err){
            console.log(decode);
            next();
        }else{
            res.json("Auth failed!")
        }
    }
    const result = jwt.verify(req.body.token,'this_is_secret',resultOfVerify)
})

app.post('/createCars',(req,res)=>{
    const bodyData = req.body;
    console.log(bodyData)
    if(bodyData.cars.length > 0 && !data[bodyData.name]){
        data[bodyData.name] = bodyData.cars;
        res.status(200);
        res.send("Done");
    }else{
        res.status(400);
        res.send("You should provide the cars in data or the name is already in database");
    }
})

app.post('/getCars',(req,res)=>{
    const bodyData = req.body;
    if(data[bodyData.name]){
        const response = {
            status:true,
            cars:data[bodyData.name]
        }
        res.send(response)
    }else{
        const response = {
            status:false,
        }
        res.status(404);
        res.send(response);
    }
})

app.get('/',(req,res)=>{
    res.status(200);
    res.setHeader('Access-Control-Allow-Origin','*');
    res.send("Hello world");
})

app.listen(3333,()=>{
    console.log("Server listening at localhost:3333");
})

module.exprots = app;