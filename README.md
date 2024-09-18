# Financial-Tracker

A simple JavaScript-based app that helps users manage their personal finances by tracking income and expenses, selecting different currencies, and visualizing data through interactive charts.

## Features

- **Transaction Tracking**: Easily add income or expense transactions with descriptions and amounts.
- **Currency Selection**: Select between different currencies (UAH, USD, EUR) through a sliding panel, with automatic conversion of all transactions and balance.
- **Data Visualization**: View a breakdown of income and expenses using a dynamic pie chart created with **Chart.js**.
- **Real-Time Balance Update**: Instantly view your updated balance as you add or remove transactions.
- **Clear Transactions**: Reset all tracked transactions with the clear button.
- **Export Financial Data**: Export your financial data to CSV files for easy sharing and reporting.

## Technologies Used

- **HTML/CSS**: For the user interface and styling.
- **JavaScript**: For handling application logic, including transaction tracking and balance calculation.
- **Chart.js**: For visualizing financial data with pie charts.
- **Responsive Design**: The app is designed to be user-friendly across different screen sizes.
- **API**: For real-time currency conversion.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Wertoquri/Financial-Tracker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Financial-Tracker
   ```

3. Open `index.html` in your preferred web browser to run the app locally.

## Usage

1. **Add a transaction**: Fill in the description, amount, and select whether it is income or expense, then click "Add".
2. **Choose a currency**: Click the "Select Currency" button to open the sliding panel, choose a currency, and apply it. All amounts will be converted accordingly.
3. **View statistics**: The pie chart will display the percentage of income and expenses dynamically.
4. **Clear transactions**: Click the "Clear Transactions" button to remove all current transactions from the list.

