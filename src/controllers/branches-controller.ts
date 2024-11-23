import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const createBranch = async (req: Request, res: Response) => {
    res.status(200).json({message: 'Success'})
}

export const getAllBranches = async (req: Request, res: Response) => {
    res.status(200).json([])
}

export const getUserBranches = async (req: Request, res: Response) => {
    res.status(200).json([])
}

export const getStoreBranches = async (req: Request, res: Response) => {
    res.status(200).json([])
}

export const getBranchDetails = async (req: Request, res: Response) => {
    res.status(200).json({message: "Success"})
}

export const updateBranch = async (req: Request, res: Response) => {
    res.status(200).json({message: "Success"})
}

export const deleteBranch = async (req: Request, res: Response) => {
    res.status(201).json({message: "Deleted"})
}

const branchErrorHandler = (error: any, res: Response) => {
    if(error instanceof PrismaClientKnownRequestError){
        if (error.code === "P2001") {
            res.status(404).json({ error: "Branch not found" });
            return;
          }
          if (error.code === "P2011") {
            res.json({ error: `${error.message}` });
            return;
          }
    }else{
        res.status(500).json({error: "Something went wrong"})
    }
}