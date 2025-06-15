document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const textInput = document.getElementById('text');
  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const balance = document.getElementById('balance');
  const incomeDisplay = document.getElementById('money-plus');
  const expenseDisplay = document.getElementById('money-minus');
  const transactionList = document.getElementById('list');

  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  function updateUI() {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
      const { text, amount, category, type } = transaction;
      const listItem = document.createElement('li');
      listItem.classList.add(type === 'income' ? 'plus' : 'minus');

      listItem.innerHTML = `
        <span>${text} - ${category}</span>
        <span>$${amount}</span>
        <button class="remove-btn" data-index="${index}">X</button>
      `;

      transactionList.appendChild(listItem);

      if (type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
      totalBalance += type === 'income' ? amount : -amount;
    });

    balance.textContent = `$${totalBalance.toFixed(2)}`;
    incomeDisplay.textContent = `+$${totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `-$${totalExpense.toFixed(2)}`;

    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  // Function to remove a transaction
  function removeTransaction(event) {
    const button = event.target;
    if (button.classList.contains('remove-btn')) {
      const index = button.getAttribute('data-index');
      transactions.splice(index, 1);
      updateUI();
    }
  }

  // Add event listener for remove button
  transactionList.addEventListener('click', removeTransaction);

  function addTransaction(event) {
    event.preventDefault();

    const text = textInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const category = categoryInput.value.trim();
    const type = document.querySelector('input[name="transactionType"]:checked').value;

    if (text === '' || isNaN(amount) || category === '') {
      alert('Please enter valid details!');
      return;
    }

    const newTransaction = { text, amount, category, type };
    transactions.push(newTransaction);

    updateUI();

    textInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
  }

  form.addEventListener('submit', addTransaction);

  updateUI();
});
