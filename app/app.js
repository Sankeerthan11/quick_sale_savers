// Import express.js
const express = require("express");

// Create express app
var app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const { User } = require("./models/user");
const bcrypt = require('bcryptjs');

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
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));
// cookie parser middleware
app.use(cookieParser());
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// Create a route for root - /
app.get("/", function(req, res) {
    console.log(req.session);
    if (req.session.uid) {
		res.send('Welcome back, ' + req.session.uid + '!');
	} else {
		res.render("login");
	}
	res.end();
});

app.post('/user',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get("/createproduct", function(req, res) {
    res.render("createproducts");
});
app.get("/product/edit/:id", async function (req, res) {
    const productId = req.params.id;

    const sql = 'SELECT * FROM products WHERE product_id = ?';
    try {
        const product = await db.query(sql, [productId]);
        if (product.length > 0) {
            // Render the updateproducts template with the product data
            res.render("updateproducts", { product: product[0] });
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Task 2 display a formatted list of products
app.get("/products", function(req, res) {
    var sql = 'select * from products';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-products template
    	    // The rows will be in a variable called data
        res.render('all-products', {data: results});
    });
});
// Task 2 display a formatted list of products
app.get("/admin-dashboard", function(req, res) {
    var sql = 'select * from products';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-products template
    	    // The rows will be in a variable called data
        res.render('admin-dashboard', {data: results});
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
app.get("/home", function(req, res) {
    res.render("home");
});

// profile route
app.get('/profile', async function (req, res) {
    const userId = req.session.uid;
    const sql = 'SELECT * FROM Users WHERE id = ?';
    try {
        const user = await db.query(sql, [userId]);
        // Assuming that user[0] contains the user data, adjust accordingly if needed
        res.render('profile', { data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    const params = req.body; // Declare as const
    const user = new User(params.email);
    
    try {
        const uId = await user.getIdFromEmail();
        if (uId) {
            const match = await user.authenticate(params.password);
            console.log(match);
            if (match) {
                req.session.uid = uId;
                req.session.loggedIn = true;
                console.log(req.session.id);
                res.redirect('/admin-dashboard');
            } else {
                res.render('login', { errorMessage: 'Invalid password' });
            }
        } else {
            res.send('Invalid email');
        }
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

app.post('/products', async (req, res) => {
    const { product_name, category, original_price, discount_price, expiration_date, quantity, retailer_id } = req.body;

    try {
        const sql = 'INSERT INTO products (product_name, category, original_price, discount_price, expiration_date, quantity, retailer_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [product_name, category, original_price, discount_price, expiration_date, quantity, retailer_id];
        
        await db.query(sql, values);
        res.render('product-success', { message: 'Product created successfully' });
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.render('error', { error: 'Failed to create product' });
    }
});



// create User api
app.post('/signup1', async (req, res) => {
    const { email, password} = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Prepare SQL query
        const sql = 'INSERT INTO Users(email, password) VALUES (?, ?)';
        const values = [email, hashedPassword];
        // Execute SQL query
        await db.query(sql, values);

        res.render('signup', { success: 'registration successful' });
    } catch (error) {
        console.log(error)
        res.render('signup', { error: 'error' });
    }
});

// Logout
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.post('/update-product/:id', async (req, res) => {
    const productId = req.params.id;
    const { product_name, category, original_price, discount_price, expiration_date, quantity, retailer_id } = req.body;

    try {
        const sql = 'UPDATE products SET product_name = ?, category = ?, original_price = ?, discount_price = ?, expiration_date = ?, quantity = ?, retailer_id = ? WHERE product_id = ?';
        const values = [product_name, category, original_price, discount_price, expiration_date, quantity, retailer_id, productId];
        
        const result = await db.query(sql, values);
        if (result.affectedRows > 0) {
            res.render('product-success', { message: 'Product updated successfully' });
        } else {
            res.render('error', { error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.render('error', { error: 'Failed to update product' });
    }
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