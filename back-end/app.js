const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 4000;

function getMySqlConnection() {
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'flyarts_quotidian'
    });

    connection.connect();

    return connection;
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    response.send("Quotidian API");
});

// =========================
// ==== Account service ====
// =========================

// Get all users.
app.get('/users', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    let connection = getMySqlConnection();

    connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error)
            throw error;

        console.log(results);

        console.log(results);
    });

    connection.end();

    response.send("fdsfsd");
});

// Get user with its ID.
app.get('/users/${id}', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Add a new user.
app.post('/user', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Update user's data.
app.put('/users/${id}', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Delete a user
app.delete('/users/${id}', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Log the user.
app.post('/users/login', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Change user's name.
app.put('/users/infos/${id}', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Change user's password.
app.put('/users/password/${id}', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});


// ======================
// ==== Site service ====
// ======================

// Get all sites associated to a user.
app.get('/sites/${userId}', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Open a site and uptade its data.
app.post('/sites/open', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Add a new site.
app.post('/sites', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Update a site.
app.put('/sites', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

// Update a site.
app.delete('/sites/${siteId}', (request, response) => {
    // Get the data from the request body
    const data = request.body;
    console.log(data);

    response.send("fdsfsd");
});

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});