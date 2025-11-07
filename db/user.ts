import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true},
        email : {type: String, require: true},
        authentication: {
            password: {type: String, require: true, select: false},// select : false => no one can fetch password
            salt: {type: String, select: false},
            sessionToken: {type: String, select: false},
        }
    }
);

// turn schema to model
export const userModel = mongoose.model("User", userSchema);

export const getUsers = () => userModel.find();

export const getUserByEmail = (email: string) => userModel.findOne({email});

export const getUserBySessiontoken = (token: string) => userModel.findOne({'authentication.sessionToken': token});

export const getUserByID = (id:string) => userModel.findById({id})// the id is bson in mongo

export const createUser = (values: Record<string, any>) => new userModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => userModel.findOneAndDelete({_id:id});