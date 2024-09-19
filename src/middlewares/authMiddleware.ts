import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

type User ={
    id: string,
    role: string,
}
declare module 'express' {
    interface Request {
      user?: User 
    }
  }
  

const verifyToken = async (req: Request, res: Response, next: NextFunction) =>{
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
     return res.status(401).json({ error: 'No token provided, not authenticated' })
    }
    jwt.verify(token, 'hash', (error, decoded)=> {
        if(error){
            console.log(error)
            return res.json({error: 'Invalid token, not authenticated'})
        }
        req.user = decoded as unknown as User
        next()
    
    } )
    
}

export default verifyToken

