import React, {
  useMemo,
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  generateTransactionHistory,
  calculateNetBalance,
  calculateTotalCashback,
} from './walletEngine';

const allTransactions = generateTransactionHistory(200);

export default function WalletScreen() {

  const [filter, setFilter] = useState('Todos');

  const filteredTransactions = useMemo(() => {

    if (filter === 'Ingreso') {
      return allTransactions.filter(
        t => t.type === 'Ingreso'
      );
    }

    if (filter === 'Retiro') {
      return allTransactions.filter(
        t => t.type === 'Retiro'
      );
    }

    return allTransactions;

  }, [filter]);

  const netBalance = calculateNetBalance(allTransactions);

  const totalCashback = calculateTotalCashback(allTransactions);

  const renderItem = useCallback(({ item }) => (

    <View style={styles.card}>

      <View>

        <Text style={styles.type}>
          {item.type}
        </Text>

        <Text>
          Cuenta: {item.accountNumber}
        </Text>

        <Text>
          Estado: {item.status}
        </Text>

      </View>

      <View>

        <Text
          style={[
            styles.amount,

            item.type === 'Ingreso'
              ? styles.income
              : styles.withdraw,
          ]}
        >
          ${item.amount.toLocaleString('es-CO')}
        </Text>

      </View>

    </View>

  ), []);

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Saldo Neto Total
      </Text>

      <Text style={styles.balance}>
        ${netBalance.toLocaleString('es-CO')}
      </Text>

      <Text style={styles.cashback}>
        Puntos ADSO: {totalCashback.toLocaleString('es-CO')}
      </Text>

      <View style={styles.buttons}>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilter('Ingreso')}
        >
          <Text style={styles.buttonText}>
            Ver solo Ingresos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilter('Retiro')}
        >
          <Text style={styles.buttonText}>
            Ver solo Retiros
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFilter('Todos')}
        >
          <Text style={styles.buttonText}>
            Ver Todos
          </Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  balance: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'blue',
  },

  cashback: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  buttonText: {
    color: '#fff',
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f4f4f4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  type: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  income: {
    color: 'green',
  },

  withdraw: {
    color: 'red',
  },

});