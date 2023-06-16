import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
// import { users } from "./data/users";
import { appRoutes } from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", appRoutes())
app.use("/users/:id", appRoutes());

app.listen(process.env.PORT, () =>{
    console.log("Servidor rodando na porta " + process.env.PORT + "!");
    
}
)