"use client"

import Image from "next/image"
import Link from "next/link"
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import examApi from "@/app/api/examApi"
import { useAppSelector } from "@/redux/store";
import { convertToVietnamTime, formatCash } from "@/app/helper/FormatFunction"
import { Dropdown } from 'flowbite-react';
import { ExclamationCircleIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';
import { DataTable } from "@/app/_components/Table/TableFormat"
import { columns } from "@/app/_components/Table/AssignmentColumns/columns"


export default function AssignmentDashboard() {

    const user = useAppSelector(state => state.authReducer.user);
    const [assignments, setAssignments] = useState<any>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    useEffect(() => {
        async function fetchData() {
            await examApi.getAssigmnentByTeacherId(`${user.id}`, page).then((data: any) => {
                setAssignments(data.data.assignments)
                setPageCount(Math.floor(data.data.count))
            })
        }
        fetchData()
    }, [page, user.id]);


    return (
        <div>
            <div>
                <div className="font-bold text-[#171347] text-lg">Lọc kết quả</div>
                <div className="p-5 bg-white mt-4 rounded-lg">
                    dfs
                </div>
            </div>
            <div className="mt-5">
                <div className="font-bold text-[#171347] text-lg">Kết quả làm bài</div>
                <div className="container mx-auto bg-white p-4 rounded-lg mt-4">
                    <DataTable columns={columns} data={assignments.map((assignment: any) => { return { ...assignment, time_end: convertToVietnamTime(assignment.time_end) } })} page={page} setPage={setPage} pageCount={pageCount} />
                </div>
            </div>
        </div>
    )
}

