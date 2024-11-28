import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { branchSchema } from "../validators/branch-validator";

const prisma = new PrismaClient();

const userSelect = {
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  id: true,
};

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
            user: {
              select: userSelect,
            },
          },
        },
        user: {
          select: userSelect,
        },
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
  try {
    if (!req.user)
      return res.status(404).json({ error: "Log in to view your branches" });
    const { id, role } = req.user;

    if (role === "store_admin") {
      const branches = await prisma.branch.findMany({
        where: {
          store: {
            user_id: id,
          },
        },
        include: {
          store: {
            include: {
              user: {
                select: userSelect,
              },
            },
          },
          user: {
            select: userSelect,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(branches);
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }
  } catch (error) {
    branchErrorHandler(error, res);
  }
};

export const getStoreBranches = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
      where: {
        store_id: req.params.store_id,
      },
      include: {
        user: {
          select: userSelect,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(branches);
  } catch (error) {
    branchErrorHandler(error, res);
  }
};

export const getBranchDetails = async (req: Request, res: Response) => {
  try {
    const branch = await prisma.branch.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        user: {
            select: userSelect
        }, store: {
            include: {
                user: {
                    select: userSelect
                }
            }
        }
      }
    });

    return res.status(200).json(branch)
  } catch (error) {
    branchErrorHandler(error, res);
  }
};

export const updateBranch = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.json(401).json({error: "Login to update branch"})
    const {id, role} = req.user

    if(role === 'store_admin'){
        const branch = await prisma.branch.update({
            where: {
                user_id: id,
                id: req.params.id,
            },
            data: req.body
        })

        return res.status(201).json(branch)
    }else{
        return res.status(403).json({error: "Not authorized"})
    }
  } catch (error) {
    branchErrorHandler(error, res)
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  try{
    if (!req.user) return res.json(401).json({error: "Login to delete branch"})
    const {id, role} = req.user

    if(role === 'store_admin'){
        await prisma.branch.delete({
            where: {
                id: req.params.id, 
                user_id: id
            }
        })
        return res.status(204).json({message: "Branch deleted"})
    }else{
        return res.status(403).json({error: "Not authorized"})
    }
  } catch(error){
    branchErrorHandler(error, res)
  }
};

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
