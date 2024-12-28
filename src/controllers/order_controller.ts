import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const getAllOrders = async(req: Request, res: Response) => {
  try {
   res.json({ message: "All Orders" });
  } catch (error) {
    orderErrorHandler(error, res);
}
}

export const createOrder = async(req: Request, res: Response) => {
  try {
    res.json({ message: "Order created" });
  } catch (error) {
    orderErrorHandler(error, res);
  }
}

export const getOrderDetails = async(req: Request, res: Response) => {
    try {
        res.json({ message: "Order Details" });
    } catch (error) {
        orderErrorHandler(error, res);
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        res.json({ message: "Order updated" });
    } catch (error) {
        orderErrorHandler(error, res);
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        res.json({ message: "Order deleted" });
    } catch (error) {
        orderErrorHandler(error, res);
    }
}

const orderErrorHandler = (error: any, res: Response) => {
    if (error instanceof PrismaClientKnownRequestError){
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Order not found" });
        }
        if(error.code === "P2001"){
            return res.status(404).json({ error: "Order not found" });
        }
        if (error.code === "P2011") {
            res.json({ error: `${error.message}` });
            return;
        }
    }else{
        res.status(500).json({ error: "Something went wrong" });
    }
}