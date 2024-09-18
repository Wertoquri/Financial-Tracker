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
    const exportButton = document.getElementById('export-btn');

    let transactions = [];
    let balance = 0;
    let chart;
    let currency = 'UAH';  // Default currency
    let exchangeRates = {};  // Empty object to hold exchange rates

    // Fetch exchange rates from the API
    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/UAH'); // Update URL to use your API
            const data = await response.json();
            exchangeRates = data.rates;
            exchangeRates.UAH = 1; // Set base currency rate to 1
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    }

    fetchExchangeRates(); // Fetch exchange rates on load

    function updateBalance() {
        balance = transactions.reduce((acc, transaction) => {
            return acc + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
        }, 0);
        const convertedBalance = balance * exchangeRates[currency];
        balanceElement.textContent = `Balance: ${convertedBalance.toFixed(2)} ${currency}`;
    }

    function renderTransactions() {
        transactionsList.innerHTML = ''; // Clear the transaction list before adding new ones
        transactions.forEach((transaction) => {
            const convertedAmount = transaction.amount * exchangeRates[currency];
            const li = document.createElement('li');
            li.innerHTML = `
                ${transaction.description} 
                <span>${transaction.type === 'income' ? '+' : '-'}${convertedAmount.toFixed(2)} ${currency}</span>
                <button class="delete-btn" data-id="${transaction.id}">Delete</button>
            `;
            transactionsList.appendChild(li);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    function updateChart() {
        const income = transactions
            .filter(transaction => transaction.type === 'income')
            .reduce((acc, transaction) => acc + transaction.amount * exchangeRates[currency], 0);
        
        const expense = transactions
            .filter(transaction => transaction.type === 'expense')
            .reduce((acc, transaction) => acc + transaction.amount * exchangeRates[currency], 0);

        if (chart) {
            chart.destroy(); // Remove the old chart before creating a new one
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

    // Handle form submission
    transactionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);
        const type = typeSelect.value;

        if (description && !isNaN(amount)) {
            const transaction = { id: Date.now(), description, amount, type }; // Add a unique ID
            transactions.push(transaction);
            updateBalance();
            renderTransactions();
            updateChart();

            descriptionInput.value = '';
            amountInput.value = '';
        }
    });

    // Handle clearing transactions
    clearButton.addEventListener('click', () => {
        transactions = [];
        updateBalance();
        renderTransactions();
        updateChart();
    });

    // Show or hide the currency selection panel
    currencyButton.addEventListener('click', () => {
        currencyPanel.style.display = currencyPanel.style.display === 'none' || !currencyPanel.style.display ? 'block' : 'none';
    });

    // Apply selected currency
    applyCurrencyButton.addEventListener('click', () => {
        currency = currencySelect.value;
        updateBalance();
        renderTransactions();
        updateChart();
        currencyPanel.style.display = 'none'; // Hide the panel after applying
    });

    function handleEdit(event) {
        const id = event.target.getAttribute('data-id');
        const transaction = transactions.find(t => t.id === parseInt(id));
        if (transaction) {
            // Handle editing logic here (e.g., open a form to edit the transaction)
        }
    }

    function handleDelete(event) {
        const id = event.target.getAttribute('data-id');
        transactions = transactions.filter(t => t.id !== parseInt(id));
        updateBalance();
        renderTransactions();
        updateChart();
    }

    // Export transactions to CSV
    function exportToCSV() {
        const csvRows = [];
        const headers = ['Description', 'Amount', 'Type', 'Currency'];
        csvRows.push(headers.join(','));

        transactions.forEach(transaction => {
            const row = [
                transaction.description,
                transaction.amount.toFixed(2),
                transaction.type,
                currency
            ];
            csvRows.push(row.join(','));
        });

        const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(csvData);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Add an export button to the UI and handle its click event
    exportButton.addEventListener('click', exportToCSV);

    updateChart();
});
