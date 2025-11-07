import express from "express";
import http from "http";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router/index.js";

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

// mongodb+srv://<username>:<password>@<host_url>:><port>?options...
const MONGO_URL = "mongodb://admin:password@localhost:27017";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((error: Error) => {
    console.error("MongoDB connection error:", error);
});

const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}. Closing http server.`);
    server.close(async () => {
        console.log('Http server closed.');
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
};

// For nodemon restarts
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

// For app termination
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// For container termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// ------------
//  app uses the router

app.use("/", router());