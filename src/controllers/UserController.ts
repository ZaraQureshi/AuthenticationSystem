import { UserService } from "../service/UserService";

export class UserController {
    constructor(private userService:UserService){

    }

    getAllUsers=async ()=>{
        try{
            const users=await this.userService.getAllUsers();
            console.log(users)
        }
        catch(e){
            console.log(e)
        }
    }
}