var express = require('express');
var router = express.Router();
var Income = require('../models/income');
var Expense = require('../models/expense');
var auth = require('../middlewares/auth')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//onboarding page
router.get('/onboarding', auth.loggedInUser, (req, res, next) => {
  res.render('onboarding');
});

//add income
router.post('/income', (req, res, next) => {
  req.body.user = req.user.id;
  Income.create(req.body, (err, income) => {
    if(err) return next(err);
    console.log(income)
    res.redirect('/dashboard');
  });
});

//add expense
router.post('/expense', (req, res, next) => {
  req.body.user = req.user.id;
  Expense.create(req.body, (err, expense) => {
    if(err) return next(err);
    console.log(expense)
    res.redirect('/dashboard');
  });
});

//dashboard
router.get('/dashboard', auth.loggedInUser, (req, res, next) => {
  var query = {}
  query.user = req.user.id;

  
  if(req.query.from && req.query.to){
    var startDate = req.query.from;
    var endDate = req.query.to;
    query.date = { $gte: startDate, $lte: endDate};
  }
  if(req.query.source){
    query.source = req.query.source;
  }
  if(req.query.category){
    query.category = req.query.category;
  }

  


  Income.find(query, (err, incomes) => {
    if(err) return next(err);
    Expense.find(query, (err, expenses) => {
      if(err) return next(err);
      res.render('dashboard', {incomes, expenses});
    });
  });
});


module.exports = router;
