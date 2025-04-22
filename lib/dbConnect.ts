import mongoose from "mongoose";


type connectionObject={
    isConnected?:number
}

const connection:connectionObject={}

async function dbConnect():Promise<void>{
if(connection.isConnected)
{
    console.log("Database is already connected::")
    return;
}

try {
    const db = await mongoose.connect(process.env.MOONGOSE_URI || '')
    connection.isConnected = db.connections[0].readyState
    console.log("MONGODB CONNECTION SUCCESSFULLY::")
} catch (error) {
    console.log("Database Connection Failed ::",error)
    process.exit()
}
}

export default dbConnect
