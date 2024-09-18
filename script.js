document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeSelect = document.getElementById('type');
    const transactionsList = document.getElementById('transactions-list');
    const balanceElement = document.getElementById('balance');
    const clearButton = document.getElementById('clear-transactions');
    const currencyButton = document.getElementById('currency-btn');
    const currencyPanel = document.getElementById('currency-panel');
    const applyCurrencyButton = document.getElementById('apply-currency');
    const currencySelect = document.getElementById('currency-select');
    const ctx = document.getElementById('financial-chart').getContext('2d');

    let transactions = [];
    let balance = 0;
    let chart;
    let currency = 'UAH';  // Default currency
    let exchangeRates = {
        UAH: 1,
        USD: 0.036,
        EUR: 0.031
    };

    // Function to update the balance with the selected currency
    function updateBalance() {
        balance = transactions.reduce((acc, transaction) => {
            return acc + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
        }, 0);
        const convertedBalance = balance * exchangeRates[currency];
        balanceElement.textContent = `${convertedBalance.toFixed(2)} ${currency}`;
    }

    // Function to render the transactions
    function renderTransactions() {
        transactionsList.innerHTML = '';  // Clear the transaction list before adding new ones
        transactions.forEach((transaction) => {
            const convertedAmount = transaction.amount * exchangeRates[currency];
            const li = document.createElement('li');
            li.innerHTML = `
                ${transaction.description} 
                <span>${transaction.type === 'income' ? '+' : '-'}${convertedAmount.toFixed(2)} ${currency}</span>
            `;
            transactionsList.appendChild(li);
        });
    }

    // Function to update the chart
    function updateChart() {
        const income = transactions
            .filter(transaction => transaction.type === 'income')
            .reduce((acc, transaction) => acc + transaction.amount * exchangeRates[currency], 0);
        
        const expense = transactions
            .filter(transaction => transaction.type === 'expense')
            .reduce((acc, transaction) => acc + transaction.amount * exchangeRates[currency], 0);

        if (chart) {
            chart.destroy();  // Remove the old chart before creating a new one
        }

        chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    label: 'Financial Distribution',
                    data: [income, expense],
                    backgroundColor: ['#4CAF50', '#FF6347']
                }]
            }
        });
    }

    // Form submission handler
    transactionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        const type = typeSelect.value;

        if (description && !isNaN(amount)) {
            const transaction = { description, amount, type };
            transactions.push(transaction);
            updateBalance();
            renderTransactions();
            updateChart();

            descriptionInput.value = '';
            amountInput.value = '';
        }
    });

    // Function to clear all transactions
    clearButton.addEventListener('click', () => {
        transactions = [];
        updateBalance();
        renderTransactions();
        updateChart();
    });

    // Show or hide the currency selection panel
    currencyButton.addEventListener('click', () => {
        if (currencyPanel.style.display === 'none' || !currencyPanel.style.display) {
            currencyPanel.style.display = 'block';
        } else {
            currencyPanel.style.display = 'none';
        }
    });

    // Apply the selected currency
    applyCurrencyButton.addEventListener('click', () => {
        currency = currencySelect.value;
        updateBalance();
        renderTransactions();
        updateChart();
        currencyPanel.style.display = 'none';  // Hide the panel after applying
    });

    updateChart();
});
