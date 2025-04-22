import { Message } from "../model/User.model"
export interface ApiResponse{
    success:boolean,
    message:string,
    isAcceptedMessanges?:boolean,
    messages?:Array<Message>

}