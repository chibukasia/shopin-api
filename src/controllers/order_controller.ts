import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const order_includes = {
    order_items: {
        include: {
            product: true
        }
    },
    shipping_address: true,
    shipping_method: true,
    payment: true,
}
export const getAllOrders = async(req: Request, res: Response) => {
  try {
   const branchId = req.params.branch_id
   const status = req.query.status
    if(!branchId){
         return res.status(400).json({error: "Branch is required"})
    }
    const orders = await prisma.order.findMany({
        where: {
            branch_id: branchId,
            status: status as any,
        },
        include: order_includes,
        orderBy: {
            createdAt: 'desc'
        }
    })

    res.status(200).json(orders)
  } catch (error) {
    orderErrorHandler(error, res);
}
}

export const getUserOrders = async(req: Request, res: Response) => {
    try{
        const userId = req?.user?.id
        const status = req.query.status
        if(!userId){
            return res.status(400).json({error: "User is required"})
        }
        const orders =  await prisma.order.findMany({
            where: {
                user_id: userId,
                status: status as any
            },
            include: order_includes,
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.status(200).json(orders)
    }catch(error){
        orderErrorHandler(error, res)
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
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(401).json({ error: "Order ID is required" });
        }
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: order_includes
        });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(order);
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