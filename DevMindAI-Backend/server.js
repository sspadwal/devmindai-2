import app from "./src/app.js";
import "dotenv/config"
import {aiRoutes} from "./src/models/ai/ai.routes.js"
import cors from "cors"
const corsOptions={
    origin:"http://localhost:5173",
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization','X-User-ID'],
    credentials:true
}
const port = process.env.PORT
app.use(cors(corsOptions))
app.get("/",(req,res)=>{
    res.status(200).json({message:"hello world "})
})

app.use("/api/ai",aiRoutes)

app.listen(port,()=>{
    console.log(`server is listening on http://localhost:${port}`)
})