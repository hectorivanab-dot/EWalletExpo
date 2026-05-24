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

/* =========================
   USDT SYSTEM
========================= */

export function buyUSDT(balanceCOP, amountCOP) {

  const exchangeRate = faker.number.int({
    min: 3900,
    max: 4300,
  });

  if (amountCOP > balanceCOP) {

    return {
      status: 'Rechazado',
      message: 'Saldo insuficiente',
    };

  }

  return {
    status: 'Completado',
    exchangeRate,
    usdt: amountCOP / exchangeRate,
  };

}

/* =========================
   SAVINGS GOALS
========================= */

export function createSavingsGoals() {

  return Array.from({ length: 3 }, () => ({

    id: faker.string.uuid(),

    name: faker.finance.accountName(),

    saved: faker.number.int({
      min: 50000,
      max: 500000,
    }),

  }));

}

export function transferToSavingsGoal(
  balance,
  goals,
  goalId,
  amount
) {

  if (amount > balance) {

    return {
      status: 'Rechazado',
      message: 'Saldo insuficiente',
    };

  }

  const updatedGoals = goals.map(goal => {

    if (goal.id === goalId) {

      return {
        ...goal,
        saved: goal.saved + amount,
      };

    }

    return goal;

  });

  return {

    status: 'Completado',

    balance: balance - amount,

    goals: updatedGoals,

  };

}

/* =========================
   BUDGET SYSTEM
========================= */

export function classifyExpenses(transactions) {

  let ingresos = 0;

  let retiros = 0;

  transactions.forEach(transaction => {

    if (transaction.status !== 'Completado') {
      return;
    }

    if (transaction.type === 'Ingreso') {
      ingresos += transaction.amount;
    }

    if (transaction.type === 'Retiro') {
      retiros += transaction.amount;
    }

  });

  const percentage = (retiros / ingresos) * 100;

  if (percentage >= 71) {
    return 'Gasto Crítico';
  }

  return 'Estable';

}