import {
  generateTransactionHistory,
  calculateNetBalance,
  calculateCashback,
  calculateTotalCashback,
  buyUSDT,
  createSavingsGoals,
  transferToSavingsGoal,
  classifyExpenses,
} from '../walletEngine';

describe('Wallet Engine Tests', () => {

  test('Debe generar exactamente 50 transacciones', () => {

    const transactions = generateTransactionHistory(50);

    expect(transactions).toHaveLength(50);

  });

  test('El monto siempre debe ser positivo y mayor que cero', () => {

    const transactions = generateTransactionHistory(100);

    transactions.forEach(transaction => {
      expect(transaction.amount).toBeGreaterThan(0);
    });

  });

  test('No deben existir campos undefined', () => {

    const transactions = generateTransactionHistory(20);

    transactions.forEach(transaction => {

      Object.values(transaction).forEach(value => {
        expect(value).not.toBeUndefined();
      });

    });

  });

  test('Debe calcular correctamente el saldo neto total', () => {

    const mockTransactions = [

      {
        type: 'Ingreso',
        amount: 100000,
        status: 'Completado',
      },

      {
        type: 'Ingreso',
        amount: 50000,
        status: 'Completado',
      },

      {
        type: 'Retiro',
        amount: 30000,
        status: 'Completado',
      },

      {
        type: 'Retiro',
        amount: 20000,
        status: 'Pendiente',
      },

    ];

    const result = calculateNetBalance(mockTransactions);

    expect(result).toBe(120000);

  });

  /* =========================
     CASHBACK TESTS
  ========================= */

  test('Las transacciones menores a 50000 no generan puntos', () => {

    const result = calculateCashback({
      amount: 40000,
      status: 'Completado',
    });

    expect(result).toBe(0);

  });

  test('Transacciones rechazadas no generan cashback', () => {

    const result = calculateCashback({
      amount: 100000,
      status: 'Rechazado',
    });

    expect(result).toBe(0);

  });

  test('Transacciones pendientes no generan cashback', () => {

    const result = calculateCashback({
      amount: 100000,
      status: 'Pendiente',
    });

    expect(result).toBe(0);

  });

  test('Transacciones completadas mayores a 50000 generan 1% cashback', () => {

    const result = calculateCashback({
      amount: 100000,
      status: 'Completado',
    });

    expect(result).toBe(1000);

  });

  test('Debe calcular correctamente el cashback total', () => {

    const transactions = [

      {
        amount: 100000,
        status: 'Completado',
      },

      {
        amount: 200000,
        status: 'Completado',
      },

      {
        amount: 30000,
        status: 'Completado',
      },

      {
        amount: 150000,
        status: 'Rechazado',
      },

    ];

    const result = calculateTotalCashback(transactions);

    expect(result).toBe(3000);

  });

});
/* =========================
   USDT TESTS
========================= */

test('Debe rechazar compra USDT por saldo insuficiente', () => {

  const result = buyUSDT(10000, 50000);

  expect(result.status).toBe('Rechazado');

});

test('Debe convertir correctamente COP a USDT', () => {

  const result = buyUSDT(500000, 400000);

  expect(result.usdt)
    .toBe(400000 / result.exchangeRate);

});

/* =========================
   SAVINGS GOALS TESTS
========================= */

test('Debe descontar dinero al transferir a meta de ahorro', () => {

  const goals = createSavingsGoals();

  const goalId = goals[0].id;

  const result = transferToSavingsGoal(
    200000,
    goals,
    goalId,
    50000
  );

  expect(result.balance).toBe(150000);

  expect(result.goals[0].saved)
    .toBe(goals[0].saved + 50000);

});

test('Debe generar 3 metas de ahorro', () => {

  const goals = createSavingsGoals();

  expect(goals).toHaveLength(3);

});

/* =========================
   BUDGET SYSTEM TESTS
========================= */

test('Debe clasificar como Gasto Crítico', () => {

  const transactions = [

    {
      type: 'Ingreso',
      amount: 100000,
      status: 'Completado',
    },

    {
      type: 'Retiro',
      amount: 80000,
      status: 'Completado',
    },

  ];

  expect(classifyExpenses(transactions))
    .toBe('Gasto Crítico');

});

test('Debe clasificar como Estable', () => {

  const transactions = [

    {
      type: 'Ingreso',
      amount: 100000,
      status: 'Completado',
    },

    {
      type: 'Retiro',
      amount: 40000,
      status: 'Completado',
    },

  ];

  expect(classifyExpenses(transactions))
    .toBe('Estable');

});