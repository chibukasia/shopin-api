import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createStore = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.json({ error: "Login to create store" });
    if (userId) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId as string,
        },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      if (user?.role === "store_admin") {
        const store = await prisma.store.create({
          data: {
            ...req.body,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return res.status(200).json(store);
      } else {
        return res.status(403).json({ error: "Permission denied" });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Something went wrong'})
  }
};

export const getAllStores = async (req: Request, res: Response) => {
    try{
        const role = req.user?.role
        if(role === 'super_admin'){
            const stores = await prisma.store.findMany();
            return res.status(200).json(stores);
        }
        res.status(403).json({error: 'Permission denied'})
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Something went wrong'})
    }
};


export const getUserStores = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const role = req.user?.role
        if(!userId){
            return res.status(404).json({error: 'Login to view your stores'})
        }
        
        if(role === 'store_admin' || role === 'super_admin'){
            const stores = await prisma.store.findMany({
                where: {
                    user_id: role === 'store_admin' ? userId : req.params.id 
                }
            })
            return res.status(200).json(stores)
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Something went wrong'})
    }
}

export const getStoreDetails = async(req: Request, res: Response) => {
    try {
        const store = await prisma.store.findUnique({where: {
          id: req.params.id
        }})
        if (!store){
          return res.status(404).json({error: 'Store not found'})
        }
        res.status(404).json(store)
    } catch (error) {
      console.log(error)
      res.status(500).json({error: 'Something went wrong'})
    }
}

export const updateStoreDetails = async(req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const role = req.user?.role

    if(role === 'super_admin' || role === 'store_admin'){
      const store = prisma.store.update({
        where: {
          id: req.params.id,
        },
        data: req.body
      })
      if(!store) return res.status(404).json({error: 'Store not found'})
      res.status(201).json(store)
    }else{
      return res.status(404).json({error: 'Permission denied'})
    }
  } catch (error) {
    console.log(error)
      res.status(500).json({error: 'Something went wrong'})
  }
}