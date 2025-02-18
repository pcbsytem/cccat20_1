import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());

type Input = {
	name: string;
	email: string;
	password: string;
	cpf: string;
	isDriver: boolean;
	carPlate: string;
}

const validateBody = (input: Input) => {
	const validateResult: { [key: string]: any } = {
		name: input.name.match(/[a-zA-Z] [a-zA-Z]+/),
		email: input.email.match(/^(.+)@(.+)$/),
		password: input.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/),
		cpf: validateCpf(input.cpf),
		isDriver: input.isDriver,
		carPlate: input.carPlate.match(/[A-Z]{3}[0-9]{4}/)
	}
	const errorList = Object.keys(validateResult).map((key: string) => {
		if (validateResult[key as keyof typeof validateResult] === null) {
			throw new Error(`${key} is invalid`);
		}
	});

	return errorList.length > 0;
}

app.post("/signup", async function (req, res) {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		let result;
		const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);

		if (!acc && validateBody(input) && input.isDriver) {
			await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);

			const obj = {
				accountId: id
			};
			result = obj;
			res.json(result);
		} else {
			res.status(422).json({ message: result });
		}
	} finally {
		await connection.$pool.end();
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountId = req.params.accountId;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [output] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
	res.json(output);
});

app.get("/accounts", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [output] = await connection.query("select * from ccca.account");
	res.json(output);
});

app.listen(3000);
