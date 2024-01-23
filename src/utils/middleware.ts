import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
require('dotenv').config()

import userModel from "../models/user";

type MiddlewareRequest = Request & {
  token: string
};

export interface ReqUser {
  id: string;
  email: string;
}

export type AuthenticatedRequest = Request & {
  user: ReqUser
}

export const extractToken = (req: MiddlewareRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    req.token = token;
  }
  next();
};


export const authenticateToken = async (req:any, res:any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401);
  
  const resp = await verifyJWT(token);

  if (!resp.success) {
    res.status(401).send({
      message: "Unauthorized"
    })
    return;
  } else {
    req.user = resp.user;
    next()
  }
}

const verifyJWT = async (token: string): Promise<{ success: boolean, user?: any }> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      async (err: jwt.VerifyErrors | null, response: string | jwt.JwtPayload | undefined) => {
        try {
          if(err || response === undefined) {
            resolve({
              success: false
            });
          }
          // @ts-ignore
          const user = await userModel.findOne({ email: response.email });
          if (!user) {
            resolve({
              success: false
            })
            return;
          }
          resolve({
            success: true,
            user: {
              id: user.id,
              email: user.email,
            }
          })
        } catch (ex) {
          resolve({
            success: false
          })
        }
  })

  })
}