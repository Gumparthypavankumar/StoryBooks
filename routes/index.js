const express = require('express');
const router = express.Router();
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
//Index Route
router.get('/',ensureGuest,(req,res)=>{
    res.render('index/welcome');
});

//About Route
router.get('/about',(req,res)=>{
    res.render('index/about');
})
//Dashboard Route
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user.id})
    .then(stories => {
        res.render('index/dashboard',{
            stories:stories
        });
    })
    .catch(err => console.log(err))
});
module.exports = router;