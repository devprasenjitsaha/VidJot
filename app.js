const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dialog = require('dialog-node');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');




// intializing express app
const app = express();

// Method Override middleware
app.use(methodOverride('_method'));

// Express Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Flash middleware
app.use(flash());


// mongodb middleware
mongoose.connect("mongodb://localhost/vidjotdb", { useNewUrlParser: true})
    .then( () => console.log('MongoDB connected....'))
    .catch(err => console.log(err));


// Load routes
const ideasRoutes = require('./routes/ideas');

// Express handlebars middleware
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Global variables
app.use(function(req, res, next){
    app.locals.info = req.flash('info');
    console.log(req.flash('info'));
    next();
});


// Express static folder
app.use(express.static(__dirname + '/public'));

// Intializing port
const port = 5000;

// GET index route
app.get('/', (req, res) => {
    var title = 'Home';
    req.flash('info', 'Flash is back!');
    console.log(req.flash('info'));
    res.render('index', {title});
});

// GET about route
app.get('/about', (req, res) => {
    var title = 'About';
    req.flash('info', 'Flash is back!');
    res.render('about', {title});
});


// Use Routes
app.use('/ideas', ideasRoutes);


// app listening
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})