import express from "express";
import { AccountRepositoryDatabase } from './AccountRepository';
import Signup from './Signup';
import Registry from './Registry';
import GetAccount from './GetAccount';

const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();
Registry.getInstance().provide("accountRepository", accountRepository);
const signup = new Signup();
const getAccount = new GetAccount(accountRepository);

app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    const output = await signup.execute(input);
    res.json(output);

  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountId = req.params.accountId;
  const output = await getAccount.execute(accountId);
  res.json(output);
});

app.listen(3000);
