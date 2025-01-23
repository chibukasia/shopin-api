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
    const userId = req?.user?.id;
    const otherUserId = req.query.user_id
    const lastOrder = await prisma.order.findFirst({
        orderBy: {
            createdAt: "desc",
          },
    })

    if(lastOrder){
        const lastOrderNumber = lastOrder.order_number.padStart(5, '0')
        const orderNumber = parseInt(lastOrderNumber) + 1
        req.body.order_number = orderNumber.toString()
    }else{
        req.body.order_number = '00001'
    }
    const order = await prisma.order.create({
        // @ts-expect-error type error
        data: {
            user_id: userId ?? otherUserId as string,
            order_number: req.body.order_number,
            shipping_cost: req.body.shipping_cost,
            total: req.body.total,
            order_items: {
                createMany: {
                    data: req.body.order_items
                }
            },
            shipping_address: {
                connectOrCreate: {
                    where: {
                        id: req.body.shipping_address.id
                    },
                    create: req.body.shipping_address
                }
            },
            shipping_method: {
                connect: req.body.shipping_method_id
            },
            payment: {
                create: req.body.payment
            },
            branch_id: req.body.branch_id,
            branch: {
                connect: req.body.branch_id
            }
        },
        include: order_includes
    });
    if(!order) return res.status(400).json({error: "Order not created"})
    if(order){
        res.status(201).json(order)
    }
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
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ error: "Order is required" });
        }
        const order = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: req.body,
            include: order_includes
        });
        res.status(201).json(order);
    } catch (error) {
        orderErrorHandler(error, res);
    }
}

// export const deleteOrder = async (req: Request, res: Response) => {
//     try {
//         res.json({ message: "Order deleted" });
//     } catch (error) {
//         orderErrorHandler(error, res);
//     }
// }

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