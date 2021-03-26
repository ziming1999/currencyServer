let express = require('express');
let app = express();
let path = require('path');
let AWS = require('aws-sdk');


AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();


app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");
    res.header("Access-Control-Allow-Methods","*");
    next();
});

app.use(function(req,res,next){
    console.log("Request IP:"+req.url);
    console.log("Request date:"+new Date());
    next();
})

app.get('/',(req,res,next)=>{
    let params = {
        TableName: "forexCurrency",
        FilterExpression : 'Currency = :currency',
        ExpressionAttributeValues : {
            ':currency' : "EUR/AUD"
        }
    };
    documentClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to scan table: ", params.TableName);
            console.error("Error JSON:", JSON.stringify(err));
        }
        else {
            res.send(data);
        }
    });
})
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Express server is running at localhost:3000"); 
})