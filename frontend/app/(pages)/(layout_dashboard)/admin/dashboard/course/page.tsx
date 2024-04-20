"use client"

import { Course, columns } from "@/app/_components/Table/CourseColumns/columns"
import { DataTable } from "@/app/_components/Table/TableFormat"
import { useEffect, useState } from "react"
import courseApi from "@/app/api/courseApi"
import { useAppSelector } from "@/redux/store";


export default function DemoPage() {
    const [courses, setCourses] = useState<any>()
    const authUser = useAppSelector(state => state.authReducer.user);
    useEffect(() => {
        async function fetchData() {
            await courseApi.getAllByTeacher(`${authUser.id}`, '1').then((data: any) => {
                setCourses(data.data.courses)

            })
        }
        fetchData()
    }, [authUser.id]);


    // const data = courses?.map((course: any) => course.name)

    return (
        <div className="container mx-auto py-2 bg-white px-5">
            <DataTable columns={columns} data={courses || []} />
        </div>
    )
}
