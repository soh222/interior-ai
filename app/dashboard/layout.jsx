import React from "react";
import Header from "./_components/Header";
import Footer from './_components/Footer'
import UserDetailProvider from '../_context/UserDetailContext'

function DashboardLayout({ children }) {
    return (
        <div>
            <Header />
            <main className="p-4 md:p-6 lg:p-8 max w-7xl mx-auto">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default DashboardLayout
