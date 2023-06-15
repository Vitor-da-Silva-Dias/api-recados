import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, () =>{
    console.log("Servidor rodando na porta " + process.env.PORT + "!");
    
}
)