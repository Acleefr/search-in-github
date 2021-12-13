import { Router } from "express";
import users from "./users";
import repos from "./repos"

const api = Router();

api.use("/users", users);

api.use("/:username", repos);

export default api;
