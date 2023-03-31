var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var nodemailer = require('nodemailer');



/* register. */
router.get('/register', function(req, res, next) {
  res.render('register')
});


// create user
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    res.redirect('/users/login');
  });
});

// login form
router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login', {error});
});

//login
router.post('/login', (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password){
    req.flash('error', 'email/password required');
    res.redirect('/users/login');
  }
  User.findOne({email: email}, (err, user) => {
    if(err) return next(err);
    if(!user){
      req.flash('error', 'wrong email');
      res.redirect('/users/login');
    }
    console.log(user)
      user.verifyPassword(password, (err, result) => {
        if(err) return next(err);
        if(!result){
          req.flash('error', 'wrong password');
          return res.redirect('/users/login');
        }
        req.session.userId = user.id;
        return res.redirect('/');
      });
    
  });
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', 
  {failureRedirect: '/'}), (req, res) => {
    res.redirect('/');
  });


router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', 
  {failureRedirect: '/'}), (req, res) => {
    res.redirect('/');
  });
  


router.get('/verify', (req, res, next) => {

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'somutestacc@gmail.com',
      pass: '63@somugrover'
    }
  });
  
  var mailOptions = {
    from: 'somutestacc@gmail.com',
    to: 'somanshu63@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});



router.get('/verify/email', (req, res, next) => {
  console.log('verified');
});


//logout
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/')
});



module.exports = router;
