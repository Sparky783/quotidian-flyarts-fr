const express = require('express');
const cors = require('cors');
//const mariadb = require('mariadb');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    response.send("Quotidian API");
});

app.post('/users/login', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});