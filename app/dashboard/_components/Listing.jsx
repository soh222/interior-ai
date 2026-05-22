"use client"
import React, { useState } from "react"
import { useUser } from "@clerk/nextjs"

function Listing() {

    const { user } = useUser()
    const [userRoomList, setUserRoomList] = useState([])

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
                <div>
                </div>
            }

        </div>
    )
}

export default Listing