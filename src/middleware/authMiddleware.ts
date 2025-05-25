import { Context } from "hono"
import { db } from "../db"
import { users } from "../drizzle/schema"
import { getUserByEmail } from "../utils"

export const emailVerification=async (c:Context)=>{
    const {email}=await c.req.json();
    const user=await getUserByEmail(email).then(res=>res[0]);
    console.log(user);
    
    const isVerified= user.isVerified;
    console.log(isVerified);
    
    if(isVerified){
        return c.json({message:"Email authenticated"},200)
    }
    return c.json({message:"Email authentication required"},400)

} 