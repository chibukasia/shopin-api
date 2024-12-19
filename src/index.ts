import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import users from './routes/users'
import auth from './routes/auth'
import stores from './routes/stores'
import branches from './routes/branches'
import products from './routes/products'
import bodyParser = require("body-parser");
import cors from 'cors'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use('/api/users', users)
app.use('/api/login', auth)
app.use('/api/stores', stores)
app.use('/api/branches', branches)
app.use('/api/products', products)
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
