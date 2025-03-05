import express from "express";
import Signup from "./signup";
import GetAccount from "./getAccount";
import { AccountDAODatabase } from './data';
import { RideDAODatabase } from "./rideDAO";
import RequestRide from "./requestRide";
import GetRide from "./getRide";

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase()
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)

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

const rideDAO = new RideDAODatabase()
const requestRide = new RequestRide(rideDAO, accountDAO)
const getRide = new GetRide(rideDAO)

app.post("/requestRide", async function (req, res) {
  const input = req.body;
  try {
    const output = await requestRide.execute(input);
    res.json(output);

  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/rides/:rideId", async function (req, res) {
  const rideId = req.params.rideId;
  const output = await getRide.execute(rideId);
  res.json(output);
});

app.listen(3000);
