import express from "express";
import Signup from "./signup";
import GetAccount from "./getAccount";
import { AccountDAODatabase } from './data';
import { RideDAODatabase } from "./RideDAO";
import RequestRide from "./RequestRide";
import GetRide from "./GetRide";
import Registry from './Registry';

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase();
Registry.getInstance().provide("accountDAO", accountDAO);
const signup = new Signup();
const getAccount = new GetAccount(accountDAO);

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
Registry.getInstance().provide("accountDAO", accountDAO);
Registry.getInstance().provide("rideDAO", rideDAO);
const requestRide = new RequestRide()
const getRide = new GetRide()

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
