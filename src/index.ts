import express from "express";
import http from "http";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import compression from "compression";
import cors from "cors";

// Initialize APP
const app = express();

// add middle wares :
const corsConfig = {
    credentials: true
}
app.use(cors(corsConfig));

app.use(compression());
app.use(cookieparser());
app.use(bodyparser.json()); // parsing body in form of json

// create HTTP server
const server = http.createServer(app);

server.listen(8080, ()=>{
    console.log("Server running on http://localhost:8080")
});