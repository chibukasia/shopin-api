import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "../validators/user-validator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prismaClient = new PrismaClient();

const maxAge = 1 * 24 * 60 * 60;
const createToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, "hash", { expiresIn: maxAge });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    userErrorHandler(error, res);
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
    const token = createToken(newUser.id, newUser.role ?? '');
    res.status(201).json({ ...newUser, token });
  } catch (error: any) {
    // res.json(error?.issues.map((issue: ZodIssue) => issue.message));
    userErrorHandler(error, res);
  }
};

export const createNewRoleUser = async (req: Request, res: Response) => {
  const { error } = userSchema.safeParse(req.body);
  if (error) {
    res.json(error.issues.map((issue) => issue.message));
    return;
  }
  const userId = req.user?.id;
  console.log(userId);
  const salt = await bycrypt.genSalt();
  const password = await bycrypt.hash(req.body.password, salt);
  const user = { ...req.body, password };
  try {
    if (userId) {
      const newUser = await prismaClient.user.create({
        data: {
          ...user,
          creater: {
            connect: {
              id: userId,
            },
          },
        },
      });
      const token = createToken(newUser.id, newUser.role ?? '');
      res.status(201).json({ ...newUser, token });
    }
  } catch (error) {
    userErrorHandler(error, res);
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
        const token = createToken(loggedInUser.id, loggedInUser.role ?? '');
        res.status(201).json({ ...loggedInUser, token });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } else {
      res.status(404).json({ error: "Email does not exist" });
    }
  } catch (error) {
    userErrorHandler(error, res);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await findUser(req, res);
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    userErrorHandler(error, res);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await findUser(req, res);
  if (user) {
    try {
      const user = await prismaClient.user.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

      res.status(201).json(user);
    } catch (error) {
      userErrorHandler(error, res);
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await findUser(req, res);
  if (user) {
    try {
      await prismaClient.user.delete({
        where: {
          id: req.params.id,
        },
      });
      res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
      userErrorHandler(error, res);
    }
  }
};

const findUser = async (req: Request, res: Response) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: req.params.id ?? req.user?.id,
    },
    include: {
      creater: true,
    }
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return null;
  }
  return user;
};

const userErrorHandler = (error: any, res: Response) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.json({ error: "Email already taken" });
    }
    if (error.code === "P2001") {
      res.status(404).json({ error: "User not found" });
    }
    if (error.code === "P2011") {
      res.json({ error: `${error.message}` });
    }
  } else {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
