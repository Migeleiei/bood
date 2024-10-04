const express = require('express');
require('dotenv').config()
const send = require('send');
const cors = require('cors')
const app = express();
const PORT = 3000;
const mysql = require('mysql2');
const { render } = require('ejs');
const bodyParser = require('body-parser');

jsonParser = bodyParser.json();


app.set('view engine', 'ejs');
app.use(cors())
app.use(express.static('public'));
app.use(express.static('pages'));
app.use("/resource",express.static('resource'))
app.use("/Gamepicture",express.static('Gamepicture'))
app.use(bodyParser.urlencoded({ extended: true }));

let config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

let connection = {}
function connect() {
    connection = mysql.createConnection(config);
    connection.connect((err) => {
        if (err) {
            console.error("Error connecting to the database:", err);
            console.log("Retrying in 5 seconds");
            setTimeout(connect, 5000)
            return;
        }
        console.log("Database is connected");
    });
}
 
connect();
 

app.get('/users', function(req,res,next){
    connection.query(
        'SELECT * FROM `users`',
        function(err,result,fields){
            res.json(result);
            console.log(result);
            console.log(result);
            console.log(fields);
        }
    )
});

app.get("/categorypage", (req, res) => {
    connection.query(
        'SELECT * FROM category',
        function(err, categories, fields) {
            if (err) {
                console.error('Error fetching categories: ' + err.stack);
                return res.status(500).send('Internal Server Error');
            }
            res.render('pages/categorypage', { categories: categories });
        }
    );
});

app.get("/EarlyAccess", (req, res) => {
    connection.query(
        'SELECT * FROM product WHERE category_id = 3', 
        function(err, products, fields) {
            if (err) {
                console.error('Error fetching products: ' + err.stack);
                return res.status(500).send('Internal Server Error');
            }
            res.render('pages/EarlyAccess', { products: products });
        }
    );
});


app.get("/adminproduct", (req, res) => {
    connection.query(
        'SELECT * FROM product', 
        function(err, products, fields) {
            if (err) {
                console.error('Error fetching products: ' + err.stack);
                return res.status(500).send('Internal Server Error');
            }
            res.render('adminpage/adminproduct', { products: products });
        }
    );
});

// Define route for Demos page
// Define route for Demos page
app.get("/Demos", (req, res) => {
    connection.query(
        'SELECT * FROM product WHERE category_id = 2', 
        function(err, products, fields) {
            if (err) {
                console.error('Error fetching products: ' + err.stack);
                return res.status(500).send('Internal Server Error');
            }

            // Modify the products array to show price as "free" if product_price_promotion is NULL
            products.forEach(product => {
                if (product.product_price_promotion === null) {
                    product.product_price_promotion = 'Free';
                }
            });

            res.render('pages/Demos', { products: products });
        }
    );
});


// Define route for Demos page
app.get("/FreeToPlay", (req, res) => {
    connection.query(
        'SELECT * FROM product WHERE category_id = 1', 
        function(err, products, fields) {
            if (err) {
                console.error('Error fetching products: ' + err.stack);
                return res.status(500).send('Internal Server Error');
            }

            // Modify the products array to show price as "free" if product_price_promotion is NULL
            products.forEach(product => {
                if (product.product_price_promotion === null) {
                    product.product_price_promotion = 'Free';
                }
            });

            res.render('pages/FreeToPlay', { products: products });
        }
    );
});

//testq

app.post("/loginpage",jsonParser,(req,res)=>{

    const {username,password} = req.body;
  connection(   ).query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        function(err, rows, fields){

            if (err) {
                console.log('Encountered an error:', err.message);
                return response.send(500, err.message);
              }
              if(rows.length == 0){
                                //  ไม่มี user
              }else{

                const user = rows[0]['username'];
                const pass = rows[0]['password'];
                console.log(user);

                if(user==username && pass == password){
                    if (username === "admin@example.com") {
                    res.redirect('/storepage');
                        }else{res.redirect('/'); 
                    }
                }else{
                    res.send("Username or password is wrong");
                }
              }
        }
    );
})

// Assuming this is your route handler for registration
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword; // Added for password confirmation
    const sql = 'INSERT INTO users (username, password) VALUES (?,?)';

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    connection.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error adding user: ' + err.stack);
            return res.status(500).send('Internal Server Error');
        }
        console.log('User registered successfully');
        res.redirect('/loginpage'); 
    });
});





app.get("/",(req,res)=>{
    res.render('pages/homepage');
});

app.get("/loginpage", (req, res) => {
    res.render('pages/loginpage');
});

app.get("/productpage", (req, res) => {
    res.render('adminpage/productpage');
});

app.get("/FreeToPlay", (req, res) => {
    res.render('pages/FreeToPlay');
});

app.get("/Demos", (req, res) => {
    res.render('pages/Demos');
});

app.get("/EarlyAccess", (req, res) => {
    res.render('pages/EarlyAccess');
});


app.get("/registerpage", (req, res) => {
    res.render('pages/registerpage');
});

app.get("/contact", (req, res) => {
    res.render('pages/contact');
});

app.get("/homepage", (req, res) => {
    res.render('pages/homepage');
})

app.get("/newspage", (req, res) => {
    res.render('pages/newspage');
})

app.get("/supportpage", (req, res) => {
    res.render('pages/supportpage');
})

app.get("/storepage", (req, res) => {
    res.render('adminpage/storepage');
})

app.get("/reportpage", (req, res) => {
    res.render('adminpage/reportpage');
})

app.get("/product", (req, res) => {
    res.render('partials/product');
})

app.get("/managementpage", (req, res) => {
    res.render('adminpage/managementpage');
})

// app.post("/loginpage", (req, res) => {
//     const username = req.body.username;
//     if (username === "admin@example.com") {
//         res.redirect('/storepage');
//     } else {
//         res.redirect('/homepage');
//     }
// });

app.listen(PORT,function(){
    console.log("port on 3000");
})