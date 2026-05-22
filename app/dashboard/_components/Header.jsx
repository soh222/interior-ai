"use client"
import React, { useContext } from 'react'
import { UserButton } from '@clerk/nextjs'
import { UserDetailContext } from '../../_context/UserDetailContext'


function Header() {

    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    return (
        <div className="navbar bg-base-100">

            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Interior AI</a>
            </div>
            
            <div className="flex-none">
                <button className="btn">
                <div className="badge badge-secondary">
                    {userDetail?.credits}
                    </div>
                Credits left
                </button>
            </div>

            <div className="flex-none">
                <UserButton />
            </div>

        </div>
    )
}

export default Header