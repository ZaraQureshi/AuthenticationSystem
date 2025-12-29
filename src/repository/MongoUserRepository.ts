import { inject, injectable } from "tsyringe";
import { IUserRepository } from "./IUserRepository";
import { TokenDTO } from "../model/Token";
import { UserDTO } from "../model/User";

@injectable()
export class MongoUserRepository implements IUserRepository {
    private usersCollection: any;
    private tokensCollection: any;
    constructor(@inject('Database') private db: any) {
        console.log("MongoUserRepository initialized with db:", db);
        this.usersCollection = this.db.collection('users');
        this.tokensCollection = this.db.collection('tokens');
    }
    async GetAllUsers(): Promise<any> {
        try{

            const users= await this.usersCollection.find().toArray();
            return users;
        }
        catch(e){
            console.error("Error fetching users from MongoDB:", e);
            throw e;
        }
        throw new Error("Method not implemented.");
    }
   async GetUserByEmail(email: string): Promise<any> {
        try{

            const user=await this.usersCollection.find({email:email}).toArray();
            return user;
        }catch(e){
            console.error("Error fetching user by email from MongoDB:", e);
            throw e;       
        } 
    }
    async InsertUser(user: UserDTO): Promise<any> {
        try{
            const result=await this.usersCollection.insertOne({
                username:user.username,
                email:user.email,            
                password:user.password,   
                role:user.role ||'user',
                isBlocked:user.isBlocked || false,
                isVerified:user.isVerified || false,
            });
            return result;     
        }
        catch(e){
            console.error("Error inserting user into MongoDB:", e);
            throw e;       
        }
        throw new Error("Method not implemented.");
    }
    UpdatePassword(email: string, password: string): Promise<any> {
        try{
            const result= this.usersCollection.updateOne(
                { email: email },
                { $set: { password: password } }  );
            return result;
        }
        catch(e){
            console.error("Error updating password in MongoDB:", e);
            throw e;       
        }
        throw new Error("Method not implemented.");
    }
    GetByToken(token: string): Promise<any> {
        try{
            const tokenData= this.tokensCollection.find({token:token}).toArray();
            return tokenData;
        }
        catch(e){
            console.error("Error fetching token from MongoDB:", e);
            throw e;       
        }
    }
    InsertToken(token: TokenDTO): Promise<any> {
        try{
            const result= this.tokensCollection.insertOne({
                userId: token.userId,
                available: token.available,
                blocked: token.blocked,
                token: token.token,
                expiryDate: token.expiryDate,
                createdAt: token.createdAt,
                updatedAt: token.updatedAt, 
            });
            return result;
        }
        catch(e){
            console.error("Error inserting token into MongoDB:", e);
            throw e;       
        }
        throw new Error("Method not implemented.");
    }
    DeleteToken(): Promise<any> {
        try{
            const result= this.tokensCollection.deleteMany({
                expiryDate: { $lte: new Date().toISOString() }
            });
            return result;

        }
        catch(e){
            console.error("Error deleting tokens from MongoDB:", e);
            throw e;       
        }
        throw new Error("Method not implemented.");
    }
    MigrateDB(): Promise<any> {
        throw new Error("Method not implemented.");
    }


    


}