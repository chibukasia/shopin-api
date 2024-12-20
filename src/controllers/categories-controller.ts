import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Response, Request } from "express";
import generalCategorySchema from "../validators/category-validator";

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    categoryErrorHandler(error, res);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const { error } = generalCategorySchema.safeParse(req.body);

    if (error) {
      return res.status(400).json(error.issues.map((issue) => issue.message));
    }
    if (user && user.role === "super_admin") {
      const category = await prisma.category.create({
        data: req.body,
      });
      return res.status(201).json(category);
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    categoryErrorHandler(error, res);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (user && user.role === "super_admin") {
      const category = await prisma.category.update({
        where: {
          id: id,
        },
        data: req.body,
      });
      return res.status(201).json(category);
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    categoryErrorHandler(error, res);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (user && user.role === "super_admin") {
      await prisma.category.delete({
        where: {
          id: id,
        },
      });
      return res.status(204).json({ message: "Deleted" });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    categoryErrorHandler(error, res);
  }
};

const categoryErrorHandler = (error: any, res: Response) => {
  console.log(error);

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    if (error.code === "P2001") {
      res.status(404).json({ error: "Branch not found" });
      return;
    }
    if (error.code === "P2011") {
      res.json({ error: `${error.message}` });
      return;
    }
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
};
