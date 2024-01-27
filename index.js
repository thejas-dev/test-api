const http = require('http');
const fs = require('fs');
const cors = require('cors');
const url = require('url');

const data = {
    usersData:['BMW','Audi','Suzuki','TATA'],
    ownerName:'Ramesh'
};


const server = http.createServer((req,res)=>{
    console.log(url.parse(req.url));
    if(req.url === '/favicon.ico'){
        res.end(fs.readFileSync('image.jpg'))
    }else{
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.writeHead(200,{'name':"Thejas hari"});
        res.end(JSON.stringify(data));
    }
})

server.listen(3333,'localhost',callBackMe);

function callBackMe(){
    console.log("Server started on localhost:3333");
} 
