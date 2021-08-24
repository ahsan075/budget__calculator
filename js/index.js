// Variables //

const addDescription = document.querySelector(".add__description");
const addValue = document.querySelector(".add__value");
const incomeList = document.querySelector(".income__list");
const expenseList = document.querySelector(".expenses__list");
const addItem = document.querySelector(".add__btn");
const deleteEvent = document.querySelector("#select");
const incomeValue = document.querySelector(".budget__income--value");
const expensesValue = document.querySelector(".budget__expenses--value");
const availableValue = document.querySelector(".budget__value");
const percentDiv = document.querySelector(".budget__expenses--percentage");
const monthDiv = document.querySelector(".budget__title--month");
let now, day, months, month, year;
now = new Date();
months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
day = now.getDate();
month = now.getMonth();
year = now.getFullYear();

// Initial Values //

monthDiv.innerHTML = `${months[month]}  ${year}`;
availableValue.innerHTML = `$0.00`;
incomeValue.innerHTML = `+ $0.00`;
expensesValue.innerHTML = `- $0.00`;
percentDiv.innerHTML = `0.00%`;

// Transaction class to create a Income or Expense Transaction //

class Transaction {
  constructor(amount, description) {
    this.amount = amount;
    this.description = description;

    this.date = `${months[month].slice(0, 3)} . ${day}th , ${year}`;
  }
}

// TransactionList class to create Lists of Transections  //

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
  }

  addNewTransaction(amount, description) {
    let transection = new Transaction(amount, description);
    if (amount < 0) {
      this.expenseList.unshift(transection);
    } else {
      this.incomeList.unshift(transection);
    }
    monthDiv.innerHTML = transection.avail;
  }

  removeTransaction(id, type) {
    if (type == "positive") {
      this.incomeList.splice(id, 1);
    } else {
      this.expenseList.splice(id, 1);
    }
  }

  budgets() {
    // Sum of Incomes //

    let sumIncome = 0;
    this.incomeList.forEach(function (income) {
      sumIncome = sumIncome + Number(income.amount);
    });
    incomeValue.innerHTML = `+ $${sumIncome.toFixed(2)}`;

    // Sum of Expenses //

    let sumExpense = 0;
    this.expenseList.forEach(function (expense) {
      sumExpense = sumExpense + Number(expense.amount);
    });
    expensesValue.innerHTML = `- $${Math.abs(sumExpense).toFixed(2)}`;

    // Total Available Budget //

    let total = 0;
    total = sumIncome + sumExpense;
    if (total == 0) {
      availableValue.innerHTML = `$${Math.abs(0).toFixed(2)}`;
    } else {
      availableValue.innerHTML = `${total < 0 ? "-" : "+"} $${Math.abs(
        total
      ).toFixed(2)}`;
    }

    // Expenses Percentage //

    let percent = 0;
    percent = (sumExpense / sumIncome) * 100;
    if (sumIncome == "") {
      percentDiv.innerHTML = `${Math.abs(0).toFixed(2)}%`;
    } else {
      percentDiv.innerHTML = `${Math.abs(percent).toFixed(2)}%`;
    }
  }
}

const list = new TransactionList();

// Create a Template for each Transaction //

const template = function (Parent, id, items) {
  Parent.insertAdjacentHTML(
    "beforeend",
    ` <div class="item  ${
      items.amount < 0 ? "negative" : "positive"
    }" data-id=${id}>  
        <div class="item__description">${items.description}</div>
        <div class="right">
            <div class="item__value">${
              items.amount < 0 ? "-" : "+"
            } $ ${Math.abs(items.amount)}</div>
            <div class="item__delete">
                <button class="item__delete--btn">
                    <i class="ion-ios-close-outline"></i>
                </button>
            </div>
        </div>
        <div class="item__date">${items.date}</div>
    </div>`
  );
};

// Adding Items by Templete Function //

const addItems = function (id, items) {
  if (items.amount < 0) {
    template(expenseList, id, items);
  } else {
    template(incomeList, id, items);
  }
};

// Submit Transaction Click Event //

addItem.addEventListener("click", function () {
  let description = addDescription.value;
  let amount = addValue.value;
  if (description == "" || amount == "") {
    return;
  } else {
    list.addNewTransaction(amount, description);
  }
  console.log(list.incomeList);
  reset();
  addDescription.value = "";
  addValue.value = "";
});

// Reset Function //

const reset = function () {
  const items = document.querySelectorAll(".item");
  for (const item of items) {
    item.remove();
  }

  for (let [index, item] of list.incomeList.entries()) {
    addItems(index, item);
  }
  for (let [index, item] of list.expenseList.entries()) {
    addItems(index, item);
  }
  list.budgets();
  monthDiv.innerHTML = `${months[month]}  ${year}`;
};

// Deleting Items Event //

deleteEvent.addEventListener("click", function (e) {
  if (e.target.nodeName === "I") {
    const parent =
      e.target.parentElement.parentElement.parentElement.parentElement;
    if (parent.classList.contains("positive") == true) {
      list.removeTransaction(parent.dataset.id, "positive");
    } else {
      list.removeTransaction(parent.dataset.id, "negative");
    }
    reset();
  }
});
