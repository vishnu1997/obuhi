import express, {Request, Response} from "express";
import {Database} from "../../db/database";

const app = express.Router();

app.post('/user', async (req: Request, res: Response) => {
    console.log(req.body);
    const body = {
        user_id: req.body.user_id,
        username: req.body.username,
        phone: req.body.phone,
        balance: req.body.balance
    }
    const database = new Database();
    await database.addUser(body);

    res.json({messages: "success"});
})

app.get('/user/:id', async (req: Request, res: Response) => {

    const database = new Database();
    const result = await database.getUserById(req.params.id);

    res.json(result);
});

app.get('/transaction/:user_id', async (req: Request, res: Response) => {
    const database = new Database();
    const result = await database.getTransaction(req.params.user_id);

    res.json(result);
});

app.put('/addFunds', async (req: Request, res: Response) => {
    const database = new Database();

    const body = {
        user_id: req.body.user_id,
        amount: req.body.amount
    }
    const result = await database.addFunds(body);

    res.json({messages: "success"});
})


app.put('/spendFunds', async (req: Request, res: Response) => {
    const database = new Database();

    const body = {
        user_id: req.body.user_id,
        amount: req.body.amount
    }
    await database.spendFunds(body).then(result => {
        if (result === "success") {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    }).catch(err => res.json(err));
})

export default app;

