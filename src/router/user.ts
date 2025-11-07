import { deleteUser, getAllUsers } from "controllers/users.js";
import express from "express";
import { isAuthenticated } from "middleware/index.js";

export default (router: express.Router) => {
  // router.get("/users", getAllUsers);
  // router.delete("/users/:id", deleteUser);
  router.get("/users", isAuthenticated, getAllUsers); // middleware to check if user is authenticated.
  router.delete("/users/:id", isAuthenticated, deleteUser); // middleware to check if the user is autheticated
};
