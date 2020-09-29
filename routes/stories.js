const express = require('express');
const router = express.Router();
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
require('../models/Story');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

//public Stories
router.get('/',(req,res)=>{
    //populate is linking the reference table to our stories
    Story.find({status:'public'})
    .populate('user')
    .sort({date:'desc'})
    .then(stories => {
        res.render('stories/index',{
            stories:stories
        });
    })
    .catch(err => console.log(err))
});

//List Stories From A user
router.get('/user/:userid',(req,res)=>{
    Story.find({user:req.params.userId,status:'public'})
    .populate('user')
    .then(stories =>{
        res.render('stories/index',{
            stories:stories
        })
    })
    .catch(err => console.log(err));
})

//Logged in User Stories
router.get('/my',ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user.id})
    .populate('user')
    .then(stories =>{
        res.render('stories/index',{
            stories:stories
        })
    })
    .catch(err => console.log(err));
});
//Add story Form
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('stories/add');
});

//Post Route
router.post('/',ensureAuthenticated,(req,res)=>{
    let allowComments;
    if(req.body.allowComments){
        allowComments = true;
    }
    else{
        allowComments = false;
    }
    const newStory={
        title:req.body.title,
        status:req.body.status,
        allowComments:allowComments,
        body:req.body.body,
        user:req.user.id
    }
    new Story(newStory)
    .save()
    .then(story =>{
        res.redirect(`/stories/show/${story.id}`);
    })
    .catch(err => console.log(err))
});

//Show single Stories
router.get('/show/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
        if(story.status == 'public'){
            res.render('stories/show',{
                story:story
            });
        }
        else{
            if(req.user){
                if(req.user.id === story.user._id){
                    res.render('stories/show',{
                        story:story
                    });  
                }
                else{
                    res.redirect('/stories');
                }
            }
            else{
                res.redirect('/stories');
            }
        }
    })
    .catch(err => console.log(err));
});

//Get Edit Stories
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Story.findOne({_id:req.params.id})
    .populate('user')
    .then(story => {
        if(story.user.id === req.user.id){
            res.render('stories/edit',{
                story:story
            });
        }
        else{
            res.redirect('/stories');
        }
    })
    .catch(err => console.log(err));
});

//Edit Stories
router.put('/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story => {
        let allowComments;
    if(req.body.allowComments){
        allowComments = true;
    }
    else{
        allowComments = false;
    }

    story.title = req.body.title;
    story.status = req.body.status;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
    .then(story => {
        res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
});

//Delete Story
router.delete('/:id',(req,res)=>{
    Story.remove({_id:req.params.id})
    .then(story => {
        res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
});

//Add Comment
router.post('/comment/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story => {
        const newComment ={
            commentBody:req.body.commentBody,
            commentUser:req.user.id
        }
        story.comments.unshift(newComment);
        story.save()
        .then(story =>{
            res.redirect(`/stories/show/${story.id}`)
        })
    })
    .catch(err => console.log(err))
})
module.exports = router;