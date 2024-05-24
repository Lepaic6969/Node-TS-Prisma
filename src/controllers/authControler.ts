import { Request, Response } from "express"; //Tipos de datos para el req y el res.
import {hashPassword,comparePassword} from '../services/password.service';
import {generateToken} from '../services/auth.service';
import prisma from '../models/prisma';


export const register=async(req:Request,res:Response):Promise<void>=>{
    const {email,password}=req.body;

    //400 -> Bad Request
    if(!email){
        res.status(400).json({message:"¡El email es obligatorio!"});
        return
    }
    if(!password){
        res.status(400).json({message:"¡El email es obligatorio!"});
        return
    }

    try{
        //Encriptamos el password
        const hashedPassword=await hashPassword(password);

        const user=await prisma.user.create(
            {
                data:{
                    email,
                    password:hashedPassword
                }
            }
        );

        const token=generateToken(user);
        //201 -> Created
        res.status(201).json({token});

    }catch(error:any){
        //ERRORES PERSONALIZADOS CON LOS CÓDIGOS QUE ARROJA PRISMA
        if(error?.code==='P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({message:'¡El email ingresado ya existe!'});
            return
        }
        res.status(500).json({message:'¡Hubo un error en el registro!'});
        
    }

}

export const login=async(req:Request,res:Response):Promise<void>=>{

    const {email,password}=req.body;

    //400 -> Bad Request
    if(!email){
        res.status(400).json({message:"¡El email es obligatorio!"});
        return
    }
    if(!password){
        res.status(400).json({message:"¡El email es obligatorio!"});
        return
    }

    try{
        const user=await prisma.user.findUnique({where:{email}});
        //404 -> Not Found
        if(!user){
            res.status(404).json({message:'¡Usuario no encontrado!'});
            return
        }
        //Tenemos que comparar la contraseña que nos manda el cliente, con la contraseña hasheada de la BD.
        const passwordMatch:boolean=await comparePassword(password,user.password);
        if(!passwordMatch){
            //401 -> Unauthorized
            res.status(401).json({message:'Usuario y contraseña no coinciden'});
            return
        }
        //Si llega hasta aquí todo está bien y generamos el token
        const token=generateToken(user);
        //200 -> Ok
        res.status(200).json({token});

    }catch(error:any){
        res.status(500).json({message:error.message});
    }
}