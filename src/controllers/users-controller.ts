import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z, ZodIssue } from "zod";
import { userSchema } from "../validators/user-validator";

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
  const users = await prismaClient.user.findMany();
  res.json(users);
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
    res.json({ ...newUser, token });
  } catch (error: any) {
    res.json(error?.issues.map((issue: ZodIssue) => issue.message));
  }
};

export const loginUser = async (req: Request, res: Response) => {
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
      res.json({ ...loggedInUser, token });
    } else {
      res.json({ error: "Invalid password" });
    }
  } else {
    res.json({ error: "Email does not exist" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await prismaClient.user.update({
    where: {
      id: Number(req.params.id),
    },
    data: req.body,
  });

  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  await prismaClient.user.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.status(201).json({ message: "User deleted successfully" });
};
