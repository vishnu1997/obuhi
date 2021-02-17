# Requirements
* Nodejs, Postgres, npm

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
