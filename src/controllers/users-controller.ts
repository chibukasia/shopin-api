import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import bycrypt from 'bcrypt';

const prismaClient = new PrismaClient()

export const getAllUsers = async (req: Request, res: Response) =>{
    const users = await prismaClient.user.findMany()
    res.json(users)
}

export const createUser = async (req: Request, res: Response) => {
    const salt = await bycrypt.genSalt()
    const password = await bycrypt.hash(req.body.password, salt)
    const user = {...req.body, password}

    const newUser = await prismaClient.user.create({
        data: user
    })
    res.json(newUser)
}

export const getUser = async (req: Request, res: Response) => {
    const user = await prismaClient.user.findFirst({where: {
        id: Number(req.params.id)
    }})
    res.json(user)
}

export const updateUser = async (req: Request, res: Response) => {
    const user = await prismaClient.user.update({
        where: {
            id: Number(req.params.id)
        },
        data: req.body
    })

    res.json(user)
}

export const deleteUser = async ( req: Request, res: Response ) => {
    await prismaClient.user.delete({
        where: {
            id: Number(req.params.id)
        }
    })
    res.status(201).json({message: 'User deleted successfully'})
}