'use client'
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Loader from "@/components/teacher/common/Loader";

import Sidebar from "@/components/teacher/Sidebar";
import Header from "@/components/teacher/Header";
import ECommerce from "@/components/teacher/Dashboard/E-commerce";

import { ReduxProvider } from '@/redux/provider';
import { useAppSelector } from "@/redux/store";

export default function TeacherLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [loading, setLoading] = useState<boolean>(true);

    const { isAuthTeacher } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        if (!isAuthTeacher) {
            redirect('/teacher/login');
        }
    }, [isAuthTeacher, redirect]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? (
                <Loader />
            ) : (
                <div className="flex h-screen overflow-hidden">
                    {/* <!-- ===== Sidebar Start ===== --> */}
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                    {/* <!-- ===== Sidebar End ===== --> */}

                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {/* <!-- ===== Header Start ===== --> */}
                        <Header
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                        {/* <!-- ===== Header End ===== --> */}

                        {/* <!-- ===== Main Content Start ===== --> */}
                        <main>
                            <div className="mx-auto max-w-screen-2xl p-4 md:p-4 2xl:p-10 bg-slate-100 min-h-[90vh]">
                                <ECommerce />
                            </div>
                        </main>
                        {/* <!-- ===== Main Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
            )}
        </div>
    )
}