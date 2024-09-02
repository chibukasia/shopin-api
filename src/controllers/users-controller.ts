import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z, ZodIssue } from "zod";
import { userSchema } from "../validators/user-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prismaClient = new PrismaClient().$extends({
  query: {
    user: {
      create({ args, query }) {
        args.data = userSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = userSchema.partial().parse(args.data);
        return query(args);
      },
      updateMany({ args, query }) {
        args.data = userSchema.partial().parse(args.data);
        return query(args);
      },
      upsert({ args, query }) {
        args.create = userSchema.parse(args.create);
        args.update = userSchema.partial().parse(args.update);

        return query(args);
      },
    },
  },
});

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id: number) => {
  return jwt.sign({ id }, "hash", { expiresIn: maxAge });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findMany();
  res.status(200).json(users);
  } catch (error) {
    userErrorHandler(error, res)
  }
  
};

export const createUser = async (req: Request, res: Response) => {
  const { error } = userSchema.safeParse(req.body);
  if (error) {
    res.json(error.issues.map((issue) => issue.message));
    return;
  }
  try {
    const salt = await bycrypt.genSalt();
    const password = await bycrypt.hash(req.body.password, salt);
    const user = { ...req.body, password };

    const newUser = await prismaClient.user.create({
      data: user,
    });
    const token = createToken(newUser.id);
    res.status(201).json({ ...newUser, token });
  } catch (error: any) {
    // res.json(error?.issues.map((issue: ZodIssue) => issue.message));
    userErrorHandler(error, res)
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const loggedInUser = await prismaClient.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
  
    if (loggedInUser) {
      const salt = await bycrypt.genSalt();
      const password = await bycrypt.compare(
        req.body.password,
        loggedInUser.password
      );
      if (password) {
        const token = createToken(loggedInUser.id);
        res.status(201).json({ ...loggedInUser, token });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } else {
      res.status(404).json({ error: "Email does not exist" });
    }
  } catch (error) {
    userErrorHandler(error, res)
  }
  
};

export const getUser = async (req: Request, res: Response) => {

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(user);
    
  } catch (error) {
    userErrorHandler(error, res)
  }
  
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
  
    res.status(201).json(user);
  } catch (error) {
    userErrorHandler(error, res)
  }
  
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prismaClient.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    userErrorHandler(error, res)
  }
  
};


const userErrorHandler = (error: any, res: Response) => {
  if (error instanceof PrismaClientKnownRequestError){
    if (error.code === 'P2002'){
      res.json({error: 'Email already taken'})
    }
    if (error.code === 'P2001'){
      res.json({error: 'User not found'})
    }
    if(error.code === 'P2011'){
      res.json({error: `${error.message}`})
    }
  }else{
    res.json({error: 'Something went wrong'})
  }
}