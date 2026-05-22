"use client"
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../config/db";
import { desc, eq } from "drizzle-orm";
import { AiGeneratedImage } from "../../../config/schema";
import RoomDesignCard from "./RoomDesignCard";
import AiOutputDialog from "../create-new/_components/AiOutputDialog";

function Listing() {

    const { user } = useUser()
    const [userRoomList, setUserRoomList] = useState([])
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState();
    useEffect(() => {
        user && GetUserRoomList();
    }, [user])

    const GetUserRoomList = async () => {
        const result = await db.select().from(AiGeneratedImage)
            .where(eq(AiGeneratedImage.userEmail, 
            user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(AiGeneratedImage.id
        ));
        setUserRoomList(result);
        console.log(result)
    }
    return (
        <div>
            <div className="flex justify-between items-center text-xl font-bold">
                Hello, {user?.fullName}
                <button className="btn btn-primary">
                                    + Generate AI Interior
                        </button>
            </div>
            {userRoomList?.length == 0?
                <div className="flex justify-center items-center h-full text-2xl text-gray-500 mt-32">
                    No Interior AI Designs Generated Yet
                </div>
                :
                <div className="grid grid-cols-3 gap-4">
                    {userRoomList.map((room, index) => (
                        <div key={index}
                            onClick={() => {
                                setOpenDialog(true);
                                setSelectedRoom(room);
                            }}>
                            <RoomDesignCard room={room} />
                        </div>
                    ))}
                </div>
            }
            <AiOutputDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                aiImage={selectedRoom?.aiImage}
                orgImage={selectedRoom?.orgImage}
            />
        </div>
    )
}

export default Listing