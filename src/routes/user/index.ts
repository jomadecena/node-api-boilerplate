import express, { Request, Response } from "express";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

import userModel from "../../models/user";
import { captureException } from "../../utils/logger";
import { AuthenticatedRequest, authenticateToken } from "../../utils/middleware";
import { cleanseUserData, createUser, findUserById, findUserByQuery } from "../../models/user/helper";

const getUserInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.sendStatus(401);
    }
    
    const user = await findUserById(id);
    
    if (!user) {
      return res.sendStatus(401);
    }
    
    return cleanseUserData(user);
  } catch (ex) {
    captureException(ex, "Unable to get user details");
    res.sendStatus(500);
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await userModel.findOne({ where: { email }});

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
  
      const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashed,
        created: dayjs().toISOString()
      };
      await createUser(data);
    } else {
      if (user.email === email) {
        res.status(409).send({ message: "User email already exists." });
      } else {
        throw new Error("User exists but email does not");
      }
    }
    res.sendStatus(201);
  } catch (ex) {
    captureException(ex, "Unable to create user");
    res.sendStatus(500);
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const secret = process.env.JWT_SECRET!;

    if (!email || !password) {
      res.status(400).send({ message: "Missing email or password." });
      return;
    }
    
    const response = await findUserByQuery({ email });

    if ((!response || []).length === 0) {
      res.status(400).send({ message: "Incorrect email or password." });
      return;
    }

    const user = response[0];

    bcrypt.compare(password, user.password).then(async (match) => {
      if (match) {
        const token = jwt.sign(
          { email: user.email },
          secret,
          {
            expiresIn: "1d",
          }
        );
        res.send({ token: token });
      } else {
        res.send({ message: "Incorrect email or password." });
      }
    });
  } catch (ex) {
    captureException(ex, "Unable to signin")
    res.sendStatus(500);
  }
}

// @ts-expect-error 
router.get("/", authenticateToken, getUserInfo)
router.post("/", create);
router.post("/login", login);

export default router;
