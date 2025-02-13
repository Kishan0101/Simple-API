import { Webhook } from "svix";
import userModel from "../models/userModel.js";

// API Controller function to manage Clerk user with database
//https://localhost:4000/api/user/webhooks

const clerkWebhoks = async(req, res)=>{
    try{

        //Create a Svix instance with clerk Webhooks secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "webhook-timestamp":req.headers["svix-timestamp"],
            "webhook-signature":req.headers["svix-signature"]
        })

        const {data, type} = req.body

        switch (type) {
            case user.created:{

                const userData = {
                    clerkID: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url

                }

                await userModel.create(userData)
                res.json({})


                break;
            }

            case user.updated:{
                const userData = {
                    
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url

                }

                await userModel.findOneAndUpdate({clerkID:data.id}, userData)
                res.json({})

                break;
            }

            case user.deleted:{
                await userModel.findOneAndDelete({clerkID:data.id})
                res.json({})

                break;
            }
                
                
        
            default:
                break;
        }

    } catch (error) {
        console.log(error.message); 
        res.json({ success: false, message: error.message }); 
    }
}

export {clerkWebhoks}