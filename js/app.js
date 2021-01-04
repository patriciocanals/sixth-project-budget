//Variables and Selectors
const form = document.querySelector('#add-expenses');
const listedExpenses = document.querySelector('#expenses ul');

let budget;

//Event Listeners
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',askBudget);
    form.addEventListener('submit',addExpenses);
};

//Classes
class Budget {
    constructor(b){
        this.budget = Number(b);
        this.remaining = Number(b);
        this.expenses = [];
    }
    newExpense(exp){
        this.expenses = [...this.expenses, exp];
        this.calculateRemaining();
    }
    calculateRemaining(){
        const totalSpent = this.expenses.reduce( (total,expense) => total + expense.amount, 0);
        this.remaining = this.budget - totalSpent;
        console.log(this.remaining)
    }
    deleteExpense(id){
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining();
    }
};
class UI {
    addBudget(a){
        const {budget,remaining} = a;
        document.querySelector('#total').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;
    }
    printAlert(m,t){
        const divAlert = document.createElement('div');
        divAlert.classList.add('text-center','alert');
        if(t === 'error'){
            divAlert.classList.add('alert-danger');
        } else {
            divAlert.classList.add('alert-success');
        }
        divAlert.textContent = m;
        
        document.querySelector('.primary').insertBefore(divAlert, form);
        setTimeout( ()=>{
            divAlert.remove();
        },3000);
    };

    showExpense(exp) {
        this.cleanHTML();
        exp.forEach( expense => {
            const {amount,name,id} = expense;
            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;
            newExpense.innerHTML = `${name}<span class="badge badge-primary badge-pill">$${amount}</span>`;

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn','btn-danger');
            btnDelete.innerHTML = 'Delete &times';
            btnDelete.onclick = () => {
                deleteExpense(id);
            }
            newExpense.appendChild(btnDelete);
            listedExpenses.appendChild(newExpense);
        });
    };
    cleanHTML(){
        while(listedExpenses.firstChild){
            listedExpenses.removeChild(listedExpenses.firstChild);
        }
    };
    updateRemaining(r){
        document.querySelector('#remaining').textContent = r;
    }
};
//Instances
const ui = new UI();

//Functions
function askBudget(){
    const userBudget = prompt('How much is your budget?');
    //validation
    if( userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0 ){
        window.location.reload();
    }

    budget = new Budget(userBudget);
    ui.addBudget(budget);
}
function addExpenses(e){
    e.preventDefault();
    const name = document.querySelector('#expense').value;
    const amount = Number(document.querySelector('#amount').value);
    //validation
    if(name === '' || amount === ''){
        ui.printAlert('Both fields are required','error');
        return;
    } else if(amount <= 0 || isNaN(amount) ){
        ui.printAlert('Amount not valid', 'error');
        return;
    }

    const expense = {name, amount, id:Date.now()}
    budget.newExpense(expense);
    ui.printAlert('Expense Added');
    const {expenses,remaining} = budget;
    ui.showExpense(expenses);
    ui.updateRemaining(remaining);
    form.reset();
}
function deleteExpense(id) {
    budget.deleteExpense(id);
    const {expenses,remaining} = budget;
    ui.showExpense(expenses)
    ui.updateRemaining(remaining);
}