const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dialog = require('dialog-node');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const DateDiff = require('date-diff');





// intializing express app
const app = express();

// Express static folder
app.use(express.static(__dirname + '/public'));

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


// Express handlebars middleware
var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        datediff: function (prevDate) {
            const currentDate = Date.now();
            var date1 = new Date(currentDate); // 2015-12-1
            var date2 = new Date(prevDate); // 2014-01-1

            var diff = new DateDiff(date1, date2);

            var seconds = parseInt(diff.seconds());

            var days = Math.floor(seconds / (3600*24));
            seconds  -= days*3600*24;
            var hrs   = Math.floor(seconds / 3600);
            seconds  -= hrs*3600;
            var mnts = Math.floor(seconds / 60);
            seconds  -= mnts*60;
            const datediffResult = ("Added " +days+"d "+hrs+"h "+mnts+"m "+seconds+"s ago");

            return datediffResult;
        }
        
    },
    extname: '.hbs'
});
    
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Load routes
const ideasRoutes = require('./routes/ideas');

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');

    //console.log(res.locals.success_msg);
    next();
});

// Intializing port
const port = 5000;



// GET index route
app.get('/', (req, res) => {
    var title = 'Home';
    res.render('index', {title});
});

// GET about route
app.get('/about', (req, res) => {
    var title = 'About';
    res.render('about', {title});
});


// Use Routes
app.use('/ideas', ideasRoutes);


// app listening
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})