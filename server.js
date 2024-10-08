const express = require('express');
const app = express();

//endpoint metodos get o post

app.get('/', (req, res) => {
    /*res.end("Bienvenido a mi servidor backend");
    console.log(__dirname);*/
    res.sendFile(__dirname + "/public/views/index.html");
});

//routing
app.use('/src', express.static(__dirname + "/src"));
app.use('/public', express.static(__dirname + "/public"));
app.use('/node_modules', express.static(__dirname + "/node_modules"));

//listening
app.listen(5000, () => {
    console.log("Servidor Node corriendo perfectamente http://localhost:5000");
});