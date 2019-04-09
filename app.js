const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// intializing express app
const app = express();

// mongodb middleware
mongoose.connect("mongodb://localhost/vidjotdb", { useNewUrlParser: true})
    .then( () => console.log('MongoDB connected....'))
    .catch(err => console.log(err));

// Express handlebars middleware
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

// Express static folder
app.use(express.static(__dirname + '/public'));

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

// Add ideas form route
app.get('/ideas/add', (req, res) => {
    var title = 'Add Ideas';
    res.render('ideas/add', {title});
});

// save ideas to db route
app.post('/ideas', (req, res) => {

});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})