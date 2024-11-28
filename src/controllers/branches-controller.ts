import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { branchSchema } from "../validators/branch-validator";

const prisma = new PrismaClient();

export const createBranch = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) return res.json({ error: "Login to create branch" });

    if (role === "store_admin") {
      const { error } = branchSchema.safeParse(req.body);

      if (error) {
        res.json(error.issues.map((issue) => issue.message));
        return;
      }
      const store = await prisma.store.findUnique({
        where: { id: req.body.store_id },
      });

      if (!store) {
        return res
          .status(404)
          .json({ error: "Requested branch store does not exist" });
      }
      const store_code = store.store_code;

      let branch_code = "";

      const lastBranchCreated = await prisma.branch.findFirst({
        where: {
          store_id: req.body.store_id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (lastBranchCreated) {
        const lastBranchCode = lastBranchCreated?.branch_code.slice(-3);
        const new_code = (Number(lastBranchCode) + 1)
          .toString()
          .padStart(3, "0");
        branch_code = store_code + new_code;
      } else {
        branch_code = `${store_code}001`;
      }

      const branch = await prisma.branch.create({
        data: {
          ...req.body,
          branch_code,
        },
      });

      return res.status(201).json(branch);
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    branchErrorHandler(error, res);
  }
};

export const getAllBranches = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
        include: {
            store: {
                include: {
                    user: true,
                }
            },
            user: true
        },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(branches);
  } catch (error) {
    branchErrorHandler(error, res);
  }
};

export const getUserBranches = async (req: Request, res: Response) => {
  res.status(200).json([]);
};

export const getStoreBranches = async (req: Request, res: Response) => {
  res.status(200).json([]);
};

export const getBranchDetails = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Success" });
};

export const updateBranch = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Success" });
};

export const deleteBranch = async (req: Request, res: Response) => {
  res.status(201).json({ message: "Deleted" });
};

const getenerateBranchUniqueCode = async () => {};
const branchErrorHandler = (error: any, res: Response) => {
  if (error instanceof PrismaClientKnownRequestError) {
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
