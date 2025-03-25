import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import AccountController from './infra/controller/AccountController';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import GetAccount from './application/usecase/GetAccount';
import { ExpressAdapter } from './infra/http/HttpServer';
import Registry from './infra/di/Registry';
import Signup from './application/usecase/Signup';

// Main - Composition Root 
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase();
const signup = new Signup();
const getAccount = new GetAccount();
const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
Registry.getInstance().provide("databaseConnection", databaseConnection);
Registry.getInstance().provide("httpServer", httpServer);
Registry.getInstance().provide("accountRepository", accountRepository);
Registry.getInstance().provide("getAccount", getAccount);
Registry.getInstance().provide("signup", signup);
new AccountController();
httpServer.listen(3000);