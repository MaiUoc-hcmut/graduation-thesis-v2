"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import {

    flexRender,

} from "@tanstack/react-table"

export type Course = {
    name: string,
    price: number
}


export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên khóa học
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Giá
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <div>Trạng thái</div>
            )
        },
    },
]
