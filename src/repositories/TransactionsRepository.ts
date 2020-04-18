import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionResponse {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): TransactionResponse {
    const balance = this.getBalance();

    const transactionResponse = {
      transactions: this.transactions,
      balance,
    };

    return transactionResponse;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce(
      (total: number, transaction: Transaction) => {
        if (transaction.type === 'income') {
          const result = total + transaction.value;
          return result;
        }
        return total;
      },
      0,
    );

    const outcome = this.transactions.reduce(
      (total: number, transaction: Transaction) => {
        if (transaction.type === 'outcome') {
          const result = total + transaction.value;
          return result;
        }
        return total;
      },
      0,
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (balance.total > 0 && type === 'outcome') {
      if (value > balance.total) {
        throw Error('Sorry you dont have enough money');
      }
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
