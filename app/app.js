// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');
// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');
// Create a route for root - /
// app.get("/", function(req, res) {
//     res.send("Hello world!");
// });

// Task 2 display a formatted list of products
app.get("/products", function(req, res) {
    var sql = 'select * from products';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-products template
    	    // The rows will be in a variable called data
        res.render('all-products', {data: results});
    });
});
// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});
app.get("/product/:id", function (req, res) {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE product_id = ?';
    db.query(sql, [productId])
        .then(results => {
            if (results.length > 0) {
                res.render('product-details', { product: results[0] });
            } else {
                res.status(404).send('Product not found');
            }
        })
});


// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/signup", function(req, res) {
    res.render("signup");
});
// Responds to a 'GET' request
app.get("/about", function(req, res) {
    res.render("about");
});

// Responds to a 'GET' request
app.get("/contact", function(req, res) {
    res.render("contact");
});
// Responds to a 'GET' request
app.get("/", function(req, res) {
    res.render("home");
});


// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});