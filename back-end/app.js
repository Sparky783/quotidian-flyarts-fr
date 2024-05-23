const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.port || 4000;

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(express.json());

let sess = {
    secret: 'quoidian-keyboard-cat',
    resave: false,
    saveUninitialized: false, // Utilisez false pour ne pas sauvegarder les sessions non initialisées
    cookie: {
        secure: false, // mettre à true si vous utilisez HTTPS
        httpOnly: true,
        maxAge: 86400000 // 24 heures
    }
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

app.get('/', (req, res) => {
    res.send("Wellcome to Quotidian API");
});

// Log the user.
app.get('/createpassword', (req, res) => {
    // Get the data from the req body
    let password = "";
    const saltRounds = 10;

    if (!password)
        return;

    // Hash a password
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err)
            throw err;

        res.send(hash);
    });
});

// =========================
// ==== Account service ====
// =========================

// Get all users.
app.get('/users', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    let connection = getMySqlConnection();

    connection.query('SELECT * FROM users', function (error, results, fields) {
        if (error)
            throw error;

        console.log(results);
    });

    connection.end();

    res.send("fdsfsd");
});

// Get user with its ID.
app.get('/users/${id}', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    res.send("fdsfsd");
});

// Add a new user.
app.post('/user', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    res.send("fdsfsd");
});

// Update user's data.
app.put('/users/${id}', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    res.send("fdsfsd");
});

// Delete a user
app.delete('/users/${id}', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    res.send("fdsfsd");
});

// Log the user.
app.post('/users/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.send('Please enter Username and Password!');
        res.end();
        return;
    }

    let db = getMySqlConnection();

    db.query('SELECT * FROM users WHERE email = ?', [email],
        (error, results, fields) => {
            if (!results) {
                res.status(500).json({ message: 'Database error' });
                res.end();
                return;
            }

            if (results.length == 0) {
                res.status(500).json({ message: 'User not found' });
                res.end();
                return;
            }

            if (results.length > 1) {
                res.status(500).json({ message: 'An error occured' });
                res.end();
                return;
            }

            if (!bcrypt.compareSync(password, results[0].password)) {
                res.status(401).json({ message: 'Incorrect Email and/or Password!' });
                res.end();
                return;
            }

            // Regenerate the session, which is good practice to help guard against forms of session fixation
            req.session.regenerate(function (err) {
                if (err) {
                    console.error('Erreur lors de la régénération de la session:', err);
                    return res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
                }

                req.session.user = results[0];

                req.session.save(function () {
                    if (err) {
                        console.error('Erreur lors de la sauvegarde de la session:', err);
                        return res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
                    }

                    res.send(req.session.user);
                    res.end();
                });
            });
        }
    );
});

// Change user's name.
app.put('/users/infos/${id}', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    res.send("fdsfsd");
});

// Change user's password.
app.put('/users/password/${id}', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    res.send("fdsfsd");
});


// ======================
// ==== Site service ====
// ======================

// Get all sites associated to a user.
app.get('/sites', (req, res) => {
    // Get the data from the req body
    if (!req.session.user) {
        res.send(null);
        res.end();
        return;
    }

    let db = getMySqlConnection();

    db.query('SELECT * FROM sites WHERE id_user=?', [req.session.user.id_user],
        (error, results, fields) => {
            console.log(results);
            res.send(results);
            res.end();
        }
    );
});

// Open a site and uptade its data.
app.post('/sites/open', (req, res) => {
    // Get the data from the req body
    const id_site = req.body.id_site;

    // Get the data from the req body
    if (!req.session.user) {
        res.send(null);
        res.end();
        return;
    }

    let db = getMySqlConnection();

    db.query('SELECT * FROM sites WHERE id_site=?', [id_site],
        (error, results, fields) => {
            console.log(results);
            res.send(results);
            res.end();
        }
    );

    res.send("fdsfsd");
});

// Add a new site.
app.post('/sites', (req, res) => {
    // Get the data from the req body
    const name = req.body.name;
    const url = req.body.url;
    const frequency = req.body.frequency;
    const nextDate = req.body.nextDate;
    const lastVisit = req.body.lastVisit;
    
    // Get the data from the req body
    if (!req.session.user) {
        res.send(null);
        res.end();
        return;
    }

    let db = getMySqlConnection();

    db.query('INSET INTO sites (id_user, name, url, frequency, next_date, last_visit) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
            req.session.user.id_user,
            name,
            url,
            frequency,
            nextDate,
            lastVisit
        ],
        (error, results, fields) => {
            console.log(results);
            res.send(results);
            res.end();
        }
    );

    res.send("fdsfsd");
});

// Update a site.
app.put('/sites', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    // Get the data from the req body
    if (!req.session.user) {
        res.send(null);
        res.end();
        return;
    }

    let db = getMySqlConnection();

    db.query('SELECT * FROM sites WHERE id_user=?', [req.session.user.id_user],
        (error, results, fields) => {
            console.log(results);
            res.send(results);
            res.end();
        }
    );

    res.send("fdsfsd");
});

// Delete a site.
app.delete('/sites/${siteId}', (req, res) => {
    // Get the data from the req body
    const data = req.body;
    console.log(data);

    res.send("fdsfsd");
});

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});

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