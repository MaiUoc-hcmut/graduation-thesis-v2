"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { ReactNode } from "react"
import { renderOnlyStar } from "@/app/helper/RenderFunction"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "id_student",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tên học sinh
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },

    {
        accessorKey: "content",
        header: ({ column }) => {
            return (
                <div className=" font-semibold">Nội dung</div>
            )
        },
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center  font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Đánh giá
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: ({ cell }) => {
            return (
                renderOnlyStar(Number(cell.getValue() || 0))
            )
        },
    },

]
