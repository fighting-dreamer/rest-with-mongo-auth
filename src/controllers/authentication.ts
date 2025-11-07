import express from "express"

import { createUser, getUserByEmail } from "../db/user.js";
import { authentication, saltRandom } from "../helpers/index.js";

export const login = async(req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email)
                            .select("+authentication.salt +authentication.password"); // very important to add to actually get the value in the app.
        if(!user) {
            return res.sendStatus(400);
        }

        const expecteHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== expecteHash) {
            console.log({
                expecteHash,
                password
            })
            return res.sendStatus(403)
        }
        // user can be successfully logged in
        // create token for the user and save it
        const salt = saltRandom();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        // set user session cookie
        res.cookie("myapp-AUTH", user.authentication.sessionToken, {
            domain: "localhost", path:"/"
        });
        return res.status(200).json(user).end();
    }catch(err) {
        console.log(err)
        return res.sendStatus(400)
    }
}

export const register = async(req: express.Request, res: express.Response) => {
    try {
        // registration process:
        const {email, password, username} = req.body;
        if(!email || !password || !username) {
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.sendStatus(400)
        }
        // now creating a new user as the input is as expected and the existing user is not there
        //  --> create authentication
        const salt = saltRandom();
        const user = await createUser({
            email,
            username,
            authentication:{
                password: authentication(salt, password),
                salt:salt
            }
        })
        return res.status(200).json(user).end();
    }catch(err) {
        console.log(err)
        return res.sendStatus(400);
    }
}