var express = require('express');
var router = express.Router();
var Income = require('../models/income');
var Expense = require('../models/expense');
var auth = require('../middlewares/auth')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
router.get('/dashboard', auth.loggedInUser, auth.list, (req, res, next) => {
  var {from, to, source, category} = req.query
  var {month } = req.query
  var cmonth = new Date().getMonth() + 1
  var year = new Date().getFullYear()
  var calculate = true;
  var incomelist = true;
  var expenselist = true;
  var query = {}
  query.user = req.user.id;
  console.log(req.query)
  if(from && to){
    var startDate = from;
    calculate = false;
    var endDate = to;
    query.date = { $gte: startDate, $lte: endDate};
  }else if(month){
    query.date = { $gte: `${month}-01`, $lte: `${month}-30`};
  }else{
    query.date = { $gte: `${year}-${cmonth}-01`, $lte: `${year}-${cmonth}-30`};
  }
  if(source && !from){
    query = {}
    calculate = false;
    expenselist = false;
    query.source = source;
  }else if(source){
    expenselist = false;
    query.source = source;
  }
  if(category && !from){
    query = {}
    calculate = false;
    incomelist = false;
    query.category = category;
  }else if(category){
    incomelist = false;
    query.category = category;
  }
  if(category && source){
    incomelist = true;
    expenselist = true;
    query.source = source;
    query.category = category;
  }

  
  Income.find(query, (err, incomes) => {
    if(err) return next(err);
    Expense.find(query, (err, expenses) => {
      if(err) return next(err);
      res.render('dashboard', {expenselist, incomelist, incomes, expenses,  calculate });
    });
  });
  
});


module.exports = router;
