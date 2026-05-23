import { fakerES_MX as faker } from '@faker-js/faker';

const transactionTypes = ['Ingreso', 'Retiro'];

const transactionStatus = [
  'Completado',
  'Pendiente',
  'Rechazado',
];

export function generateTransactionHistory(count) {

  return Array.from({ length: count }, () => ({

    id: faker.string.uuid(),

    accountNumber: faker.finance.accountNumber(10),

    type: faker.helpers.arrayElement(transactionTypes),

    amount: Number(
      faker.finance.amount({
        min: 10000,
        max: 500000,
        dec: 0,
      })
    ),

    date: faker.date.recent({
      days: 30,
    }),

    status: faker.helpers.arrayElement(transactionStatus),

  }));

}

export function calculateNetBalance(transactions) {

  return transactions.reduce((balance, transaction) => {

    if (transaction.status !== 'Completado') {
      return balance;
    }

    if (transaction.type === 'Ingreso') {
      return balance + transaction.amount;
    }

    if (transaction.type === 'Retiro') {
      return balance - transaction.amount;
    }

    return balance;

  }, 0);

}

/* =========================
   CASHBACK SYSTEM
========================= */

export function calculateCashback(transaction) {

  if (
    transaction.amount > 50000 &&
    transaction.status === 'Completado'
  ) {
    return transaction.amount * 0.01;
  }

  return 0;

}

export function calculateTotalCashback(transactions) {

  return transactions.reduce((total, transaction) => {

    return total + calculateCashback(transaction);

  }, 0);

}