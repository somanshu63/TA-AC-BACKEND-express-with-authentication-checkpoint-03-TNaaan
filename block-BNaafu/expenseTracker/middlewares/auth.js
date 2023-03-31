const Income = require('../models/income');
const Expense = require('../models/expense');
var User = require('../models/user')

module.exports = {
    loggedInUser: (req, res, next) => {
        if(req.session && req.session.userId){
            next();
        }else if(req.session.passport && req.session.passport.user){
            next();
        }else{
            req.flash('error', 'you have to login first');
            return res.redirect('/users/login');
        }
    },
    userInfo: (req, res, next) => {
        if(req.session){
            if(req.session && req.session.userId){
                var userId = req.session && req.session.userId;
            }else if(req.session.passport && req.session.passport.user){
                var userId = req.session.passport && req.session.passport.user;
            }
            if(userId){
                User.findById(userId, (err, user) => {
                    if(err) return next(err);
                    req.user = user;
                    res.locals.user = user;
                    console.log(req.user)
                    next();
                });
            }else {
                req.user = null;
                res.locals.user = null;
                next();
            }
        }
    },
    list: (req, res, next) => {
        Income.distinct('source').exec((err, incomes) => {
            if(err) return next(err);
            Expense.distinct('category').exec((err, categories) => {
                if(err) return next(err);
                req.sources = incomes;
                res.locals.sources = incomes;
                req.categories = categories;
                res.locals.categories = categories;
                next();
            });
        });
    }
}