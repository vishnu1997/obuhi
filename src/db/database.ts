import { Client }  from 'pg';
import config from 'config';
import LoggerService from "../components/logger";
import { v4 as uuidv4 } from 'uuid';

const logger = new LoggerService('database.ts');

const client = new Client({
    host: config.get('Database.host'),
    user: config.get('Database.user'),
    password: config.get('Database.password'),
    database: config.get('Database.database'),
});

client.connect((err: Error) => {
    if (err) {
        logger.error(err);
        return;
    }
    logger.info(`Connected to Postgres`);
})

interface QueryConfig {

    // the raw query text
    text: string;

    // an array of query parameters
    values?: any[];
    name?: string;
}

interface PersonalWallet {
    user_id: string;
    username?: string;
    phone?: string;
    balance?: number;
}

interface Transactions {
    user_id: string;
    transaction_type?: string;
    trans_date?: string;
    initial_balance?: number;
    amount?: number;
    final_balance?: number;
    remarks?: string;
}

export class Database {
    fetchUser: QueryConfig = {
        name: 'fetch-user',
        text: 'SELECT * FROM personal_wallet WHERE user_id = $1'
    }

    insertUser: QueryConfig = {
        name: 'insert-user',
        text: 'INSERT INTO personal_wallet (user_id, username, phone, balance) values ($1,$2,$3,$4);'
    }

    getTransactions: QueryConfig = {
        name: 'get-transactions',
        text: 'SELECT * FROM transactions WHERE user_id = $1'
    }

    insertTransactions: QueryConfig = {
        name: 'insert-transactions',
        text: 'INSERT INTO transactions (user_id, transaction_id, transaction_type, initial_balance, amount, final_balance, remarks) VALUES ($1,$2,$3,$4,$5,$6,$7)'
    }

    updateBalance: QueryConfig = {
        name: 'update-user',
        text: 'UPDATE personal_wallet SET balance=$1 where user_id=$2'
    }

    async getUserById(id: string) {
        const query: QueryConfig = this.fetchUser;
        query.values = [id];
        const result = await client.query(query);
        let row: PersonalWallet;
        if (result.rows) {
             row = result.rows[0];
        }
        return row;
    }


    async addUser(body: { balance: any; user_id: any; phone: any; username: any }) {
        const query: QueryConfig = this.insertUser;
        query.values = [body.user_id, body.username, body.phone, body.balance];
        const result = await client.query(query);
    }

    async getTransaction(user_id: string) {
        const query: QueryConfig = this.getTransactions;
        query.values = [user_id];
        const result = await client.query(query);
        let rows: PersonalWallet = result.rows;
        return rows;
    }


    async addFunds(body: { amount: any; user_id: any }) {
        const user: PersonalWallet = await this.getUserById(body.user_id);
        const query: QueryConfig = this.insertTransactions;
        query.values = [body.user_id, uuidv4().substring(0, 8), 'add', user.balance, body.amount, user.balance + parseInt(body.amount), 'success'];
        await client.query(query);

        const query2: QueryConfig = this.updateBalance;
        query2.values = [user.balance + parseInt(body.amount), user.user_id];
        await client.query(query2);
    }


    async spendFunds(body: { amount: any; user_id: any }) {
        const user: PersonalWallet = await this.getUserById(body.user_id);
        if (parseInt(body.amount) > user.balance) {
            return "Not enough money to spend";
        }

        const query: QueryConfig = this.insertTransactions;
        query.values = [body.user_id, uuidv4().substring(0, 8), 'spend', user.balance, body.amount, user.balance - parseInt(body.amount), 'success'];
        await client.query(query);

        const query2: QueryConfig = this.updateBalance;
        query2.values = [user.balance - parseInt(body.amount), user.user_id];
        await client.query(query2);
        return "success";
    }
}
