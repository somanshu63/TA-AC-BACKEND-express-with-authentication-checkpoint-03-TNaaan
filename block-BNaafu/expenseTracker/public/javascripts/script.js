var aside = document.querySelector('.aside');
var filterBtn = document.querySelector('.filter-btn');
var formIncomeBtn = document.querySelector('.form-income-btn');
var formExpenseBtn = document.querySelector('.form-expense-btn');
var filter = document.querySelector('.filter');
var formIncome = document.querySelector('.form-income');
var formExpense = document.querySelector('.form-expense');

filterBtn.addEventListener('click', () => {
    formIncome.classList.remove('block');
    formExpense.classList.remove('block');
    formIncomeBtn.classList.remove('on');
    formExpenseBtn.classList.remove('on');
    filter.classList.remove('none')
    filterBtn.classList.add('on');
});

formIncomeBtn.addEventListener('click', () => {
    filterBtn.classList.remove('on');
    formExpenseBtn.classList.remove('on');
    filter.classList.add('none');
    formExpense.classList.remove('block');
    formIncome.classList.add('block');
    formIncomeBtn.classList.add('on');
});

formExpenseBtn.addEventListener('click', () => {
    filter.classList.add('none');
    filterBtn.classList.remove('on');
    formIncomeBtn.classList.remove('on');
    formIncome.classList.remove('block');
    formExpense.classList.add('block');
    formExpenseBtn.classList.add('on');
});