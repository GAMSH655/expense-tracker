
const expenseName = document.querySelector("#expenseName");
const expenseAmount = document.querySelector("#expenseAmount");
const expenseCategory = document.querySelector("#expenseCategory");
const addExpenseBtn = document.querySelector("#addExpenseBtn");
const totalExpense = document.querySelector("#totalExpense");
const expenseContainer = document.querySelector("#expenseContainer");
const clearExpenses = document.querySelector("#clearExpenses")
const expenseNameWarning = document.querySelector(".expenseNameWarning");
const expenseAmountWarning = document.querySelector(".expenseAmountWarning");
const expenseCategoryWarning = document.querySelector(".expenseCategoryWarning");

const expenseArray = [];
let editingExpenseId = null;

function updateTotal() {
  const total = expenseArray.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  totalExpense.textContent = `₦${total.toLocaleString()}`;
}

function clearInputs() {
  expenseName.value = "";
  expenseAmount.value = "";
  expenseCategory.value = "";
}

function clearWarnings() {
  expenseNameWarning.textContent = "";
  expenseAmountWarning.textContent = "";
  expenseCategoryWarning.textContent = "";
}

function renderExpenses() {
  expenseContainer.innerHTML = "";

  expenseArray.forEach(function (expenseObject) {
    const expenseDiv = document.createElement("div");
    expenseDiv.classList.add("expenseDiv");

    const expenseText = document.createElement("p");
    expenseText.classList.add("expenseText");
    expenseText.style.whiteSpace = "pre-line";

    expenseText.textContent =
      `Expense: ${expenseObject.name}\n` +
      `Amount: ₦${expenseObject.amount.toLocaleString()}\n` +
      `Category: ${expenseObject.category}\n` +
      `Date: ${expenseObject.date}\n` +
      `Time: ${expenseObject.time}`;

    const editExpense = document.createElement("button");
    editExpense.classList.add("editExpense");
    editExpense.textContent = "Edit Expense";

    editExpense.addEventListener("click", function () {
      expenseName.value = expenseObject.name;
      expenseAmount.value = expenseObject.amount;
      expenseCategory.value = expenseObject.category;

      editingExpenseId = expenseObject.id;
      addExpenseBtn.textContent = "Save Changes";

      clearWarnings();
    });

    const deleteExpense = document.createElement("button");
    deleteExpense.classList.add("deleteExpense");
    deleteExpense.textContent = "Delete Expense";

    deleteExpense.addEventListener("click", function () {
      const index = expenseArray.findIndex(
        (expense) => expense.id === expenseObject.id
      );

      if (index !== -1) {
        expenseArray.splice(index, 1);
      }

      if (editingExpenseId === expenseObject.id) {
        editingExpenseId = null;
        addExpenseBtn.textContent = "Add Expense";
        clearInputs();
        clearWarnings();
      }

      renderExpenses();
      updateTotal();
    });

    expenseDiv.append(expenseText, editExpense, deleteExpense);
    expenseContainer.append(expenseDiv);
  });
}

addExpenseBtn.addEventListener("click", function () {
  const name = expenseName.value.trim();
  const amountStr = expenseAmount.value.trim();
  const amount = Number(amountStr);
  const category = expenseCategory.value.trim();

  clearWarnings();

  let valid = true;

  if (name === "") {
    expenseNameWarning.textContent = "Please enter an expense name.";
    valid = false;
  }

  if (amountStr === "" || !Number.isFinite(amount) || amount <= 0) {
    expenseAmountWarning.textContent = "Please enter a valid amount.";
    valid = false;
  }

  if (category === "") {
    expenseCategoryWarning.textContent = "Please select a category.";
    valid = false;
  }

  if (!valid) return;

  if (editingExpenseId !== null) {
    const expense = expenseArray.find(
      (item) => item.id === editingExpenseId
    );

    if (expense) {
      expense.name = name;
      expense.amount = amount;
      expense.category = category;
    }

    editingExpenseId = null;
    addExpenseBtn.textContent = "Add Expense";
  } else {
    const expenseObject = {
      id: Date.now(),
      name,
      amount,
      category,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    expenseArray.push(expenseObject);
  }

  renderExpenses();
  updateTotal();
  clearInputs();
  clearWarnings();
});

clearExpenses.addEventListener("click", function () {
  expenseArray.length = 0;

  expenseContainer.innerHTML = "";

  updateTotal();
});