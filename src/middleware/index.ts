import express from "express";
import {get, merge} from "lodash";

import { getUserBySessiontoken } from "db/user.js";

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies["myapp-AUTH"];// the cookies we set in login flow
        if(!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessiontoken(sessionToken);
        if(!existingUser) {
            return res.sendStatus(403);
        }
        merge(res, {existingUser})
        return next()
    }catch(err) {
        console.log(err)

        return res.sendStatus(400);
    }
}