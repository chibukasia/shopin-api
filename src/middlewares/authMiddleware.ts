import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'


const verifyToken = async (req: Request, res: Response, next: NextFunction) =>{
    const token = req.headers.authorization?.split(' ')[1]
    if(token){
        jwt.verify(token, 'hash', (error, decoded)=> {
            if(error){
                res.json({error: 'Invalid token'})
                console.log(error)
            }
            next()
        } )
    }else{
        res.json({error: 'No token is provided'})
    }
    
}

export default verifyToken