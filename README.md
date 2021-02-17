# Requirements
* Nodejs, Postgres, npm

# Postgres tables queries
```
    CREATE TABLE IF NOT EXISTS personal_wallet
    (
        user_id VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        phone VARCHAR(255) UNIQUE NOT NULL,
        balance INT,
        PRIMARY KEY (user_id)
    );
    
    CREATE TABLE IF NOT EXISTS transactions
    (
        user_id VARCHAR(255) NOT NULL,
        transaction_id VARCHAR(255) NOT NULL,
        transaction_type VARCHAR(255) NOT NULL,
        trans_date TIMESTAMP,
        initial_balance int,
        amount int,
        final_balance int,
        remarks varchar(255),
        PRIMARY KEY (transaction_id, user_id),
        FOREIGN KEY (user_id) REFERENCES personal_wallet (user_id)
    );
```
# Steps to run
- Download repo
- Change postgres configurations in config/development.json file
- First install all packages command 
    ```
    npm install
    ```
- To ***START*** server
    ```
        npm run dev
    ```
- Apis 
    ```
  POST - http://localhost:9999/user
  GET - http://localhost:9999/user/<user_id>
  GET - http://localhost:9999/transaction/<user_id>
  PUT - http://localhost:9999/spendFunds
  PUT - http://localhost:9999/addFunds
  ```
