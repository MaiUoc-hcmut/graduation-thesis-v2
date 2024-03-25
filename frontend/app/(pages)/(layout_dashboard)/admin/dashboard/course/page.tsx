"use client"

import { Course, columns } from "./payments/columns"
import { DataTable } from "./payments/data-table"
import { useEffect, useState } from "react"
import courseApi from "@/app/api/courseApi"
import { useAppSelector } from "@/redux/store";


// async function getData(): Promise<Payment[]> {

//     return [
//         {
//             id: "728ed52f",
//             amount: 100,
//             status: "pending",
//             email: "m@example.com",
//         },
//         // ...
//     ]
// }

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
