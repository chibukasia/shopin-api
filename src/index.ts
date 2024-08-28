import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import users from './routes/users'
import auth from './routes/auth'
import bodyParser = require("body-parser");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use('/users', users)
app.use('/login', auth)
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
