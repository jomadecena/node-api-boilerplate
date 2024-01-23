import express, { Request, Response } from "express";
import dayjs from "dayjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

import userModel from "../../models/user";
import { captureException } from "../../utils/logger";
import { AuthenticatedRequest, authenticateToken } from "../../utils/middleware";
import { sendCommonEmail } from "../../services/email";

const getUserInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findByPk(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
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
      await userModel.create(data);
    } else {
      if (user.email === email) {
        res.send({ message: "User email already exists." });
      } else {}
    }
  } catch (ex) {
    captureException(ex);
    res.sendStatus(500);
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const secret = process.env.JWT_SECRET!;

    if (!email || !password) {
      res.status(400).send({ message: "Missing email/password.", err: "Missing email/password." });
      return;
    }
    
    const response = await userModel.findOne({ where: { email } });

    if (!response) {
      res.status(400).send({ message: "Incorrect email/password.", err: "Incorrect email/password." });
      return;
    }

    bcrypt.compare(password, response.password).then(async (match) => {
      if (match) {
        const token = jwt.sign({ email: response.email }, secret, {
          expiresIn: "1d",
        });
        res.send({
          status: "OK",
          err: "",
          token: token
        });
      } else {
        res.send({ message: "Incorrect email/password.", err: "Incorrect email/password." });
        return;
      }
    });
  } catch (ex) {
    captureException(ex, "Unable to signin")
    res.sendStatus(500);
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const response = await userModel.findOne({ where: { email } });
    
    if (!response) {
      res.sendStatus(400);
      return;
    }
    
    const code = crypto.randomBytes(6).toString("hex");

    await userModel.update(
      { otp: code },
      {
        where: {
          email: email,
        },
      }
    );
    try {
      sendCommonEmail(
        [email],
        "Change Password Request",
        `Hi ${email}! You've requested to reset your password. Kindly enter this code ${code} to proceed.`
      )
    } catch (ex) {
      captureException(ex, "Unable to send email")
    }
    res.status(200).send({ status: "OK" });
  } catch (ex) {
    captureException(ex, "Unable to send Password Request email")
    res.sendStatus(500);
  }
}

const newPassword = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(pass, salt);

    const response = await userModel.findOne({ where: { email }});

    if (!response) {
      res.sendStatus(400);
      return;
    }
    await userModel.update(
      { password: hashed },
      {
        where: {
          email,
        },
      }
    );
    res.status(200).send({ status: "OK" });
  } catch (ex) {
    res.sendStatus(500);
  }
}

// @ts-expect-error 
router.get("/", authenticateToken, getUserInfo)
router.post("/", create);
router.post("/login", login);

export default router;
