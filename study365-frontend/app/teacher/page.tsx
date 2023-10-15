'use client'
import ECommerce from "@/components/teacher/Dashboard/E-commerce";
import { useAppSelector } from "@/redux/store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function TeacherLayout() {

    const { isAuthTeacher } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        if (!isAuthTeacher) {
            redirect('/teacher/login');
        }
    }, [isAuthTeacher, redirect]);

    return (
        <ECommerce />
    )
}