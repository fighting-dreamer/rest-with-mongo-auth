import express from "express";
import { deleteUserById, getUsers } from "db/user.js";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    }catch(err) {
        console.log(err)
        return res.sendStatus(400);
    }
}

export const deleteUser = async(req: express.Request, res: express.Response) => {
    try {
        const {id} = req.body;
        const deletedUser = await deleteUserById(id);
        return res.status(200).json(deletedUser);
    }catch(err) {
        console.log(err);
        return res.sendStatus(err);
    }
}