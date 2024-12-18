import React, { useState } from 'react';

export default function StashActions() {
    const [balance, setBalance] = useState(1000); 
    const [amount, setAmount] = useState('');

    const handleDeposit = () => {
        if (amount > 0) {
            setBalance(balance + parseFloat(amount));
            setAmount('');
            alert('Deposited successfully!');
        } else {
            alert('Enter a valid amount!');
        }
    };

    const handleWithdraw = () => {
        if (amount > 0 && amount <= balance) {
            setBalance(balance - parseFloat(amount));
            setAmount('');
            alert('Withdrawn successfully!');
        } else {
            alert('Enter a valid amount or insufficient balance!');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Stash Balance: ${balance.toFixed(2)}</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={styles.input}
            />
            <div style={styles.buttonContainer}>
                <button onClick={handleDeposit} style={styles.button}>
                    Deposit
                </button>
                <button onClick={handleWithdraw} style={styles.button}>
                    Withdraw
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '20px',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        width: '200px',
    },
    buttonContainer: {
        margin: '10px 0',
    },
    button: {
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

