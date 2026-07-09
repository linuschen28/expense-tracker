const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim()
    const amount = parseFloat(amountEl.value)

    transactions.push({
        id: Date.now(), 
        description: description,
        amount: amount
    })

    localStorage.setItem("transactions", JSON.stringify(transactions))

    updateTransactionList()
    updateSummary()

    transactionFormEl.reset()
}

function updateTransactionList() {
    transactionListEl.innerHTML = ""

    const sortedTransactions = [...transactions].sort((a, b) => a.id - b.id);

    for (const t of sortedTransactions) {
        const transactionEl = createTransactionEl(t)
        transactionListEl.appendChild(transactionEl)
    }
}

function createTransactionEl(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
  
    ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
  `;

  return li;
}

function updateSummary() {
    let balance = 0
    let income = 0
    let expense = 0

    for (const t of transactions) {
        const cost = t.amount
        balance += cost
        if (cost > 0) {
            income += cost
        } else {
            expense += cost
        }
    }

    balanceEl.textContent = formatCurrency(balance)
    incomeAmountEl.textContent = formatCurrency(income)
    expenseAmountEl.textContent = formatCurrency(expense)
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id)

    localStorage.setItem("transactions", JSON.stringify(transactions))

    updateTransactionList()
    updateSummary()
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  }).format(number);
}

updateTransactionList();
updateSummary();