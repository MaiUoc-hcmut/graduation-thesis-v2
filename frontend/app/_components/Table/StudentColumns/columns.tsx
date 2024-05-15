"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { ReactNode } from "react"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
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
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <button
                    className="flex justify-center items-center  font-semibold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowsUpDownIcon className="ml-2 h-4 w-4" />
                </button>
            )
        },
    },

]
