const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Idea model
require('../models/Idea');   
const Idea = mongoose.model('ideas');

// Ideas Lists
router.get('/', (req, res) => {
    Idea.find()
        .sort({date: 'desc'})
        .then((ideas) => {
            res.render('ideas/index', {
                ideas: ideas,
                title: 'Ideas'
            })
        });
});

// Add ideas form route
router.get('/add', (req, res) => {
    var title = 'Add Ideas';
    res.render('ideas/add', {title});
});

// Process add idea form
router.post('/', (req, res) => {
    const newUser = {
        title: req.body.title,
        details: req.body.details
    };

    new Idea(newUser)
        .save()
        .then((ideas) => {
            console.log('Data saved to db..');
            req.flash('success_msg', 'Video idea succesfully saved to db.');
            res.redirect('/ideas');
        });
});

// Edit ideas form route
router.get('/edit/:id', (req, res) => {
    const title = 'Edit Idea';
    Idea.findOne({ _id: req.params.id})
        .then((idea) => {
            res.render('ideas/edit', {title, idea});
        });
});

// Process Edit form PUT request
router.put('/edit/:id', (req, res) => {
    Idea.findOne({_id: req.params.id})
        .then((idea) => {
            // new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    console.log('Data has been updated.');
                    req.flash('success_msg', 'Video idea has been successfully updated.');
                    res.redirect('/ideas');
                });
        });
});

// Process Delete idea request
router.delete('/:id', (req, res) => {
    Idea.findOne({_id: req.params.id})
        .then(idea => {

            idea.remove()
                .then(idea => {
                    console.log(`Idea Deleted with id ${idea._id}`);
                    req.flash('success_msg', 'Video idea has been deleted.');
                    res.redirect('/ideas');
                });

            // dialog.question(`Are you sure want to delete ${idea.title}`,'Confirm','',(code, retVal, stderr) => {
            //     if (retVal == "OK") {
            //         idea.remove()
            //         .then(idea => {
            //             console.log(`Idea Deleted with id ${idea._id}`);
            //             res.redirect('/ideas');
            //         });
            //     } else {
            //         res.redirect('/ideas');
            //     }
            // });
        });
});


module.exports = router;