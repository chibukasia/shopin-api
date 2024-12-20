import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const getBranchProducts = async (req: Request, res: Response) => {
  try {
    const { branch_id } = req.params;
    if (!branch_id) {
      res.status(400).json({ error: "Branch is required" });
      return;
    }
    const products = await prisma.product.findMany({
      where:{
        branch_id: branch_id
      },
      include:{
        product_reviews: true,
        inventory: true,
        shipping: true,
        categories: true,
        attributes: true
      }
    })
    res.status(200).json(products);
    return;
  } catch (error) {
    productsErrorHandler(error, res)
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    res.status(201).json({ message: "Success" });
  } catch (error) {
    productsErrorHandler(error, res)
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    productsErrorHandler(error, res)
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    res.status(201).json({ message: "Success" });
  } catch (error) {
    productsErrorHandler(error, res)
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    res.status(204).json({ message: "Deleted" });
  } catch (error) {
    productsErrorHandler(error, res)
  }
};

export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    res.status(200).json([]);
  } catch (error) {
    productsErrorHandler(error, res)
  }
};

export const getProductsSummary = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Summary",
    });
  } catch (error) {
    productsErrorHandler(error, res)
  }
};

const productsErrorHandler = (error: any, res: Response) => {
  console.log(error);
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2001") {
      res.status(404).json({ error: "Product not found" });
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
