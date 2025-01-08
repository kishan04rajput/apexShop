import "dotenv/config";
import express from "express";
import { connect } from "./db/config.db.js";
import { routes } from "./routes/router.js";
import cookieParser from "cookie-parser";

async function main() {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(routes());

    if (!(await connect())) return;

    app.listen(4444, () => {
        console.log("Server started on port 4444!");
    });
}

main();
