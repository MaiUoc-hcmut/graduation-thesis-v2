"use client"
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from "react-hook-form"
import { Label, Modal, TextInput, Textarea, Button } from 'flowbite-react';
import discountApi from '@/app/api/discountApi';
import { formatDateTime } from '@/app/helper/FormatFunction';
import { useSearchParams } from 'next/navigation';
import { Dropdown } from 'flowbite-react';
import { useAppSelector } from '@/redux/store';
import courseApi from '@/app/api/courseApi';
import paymentApi from '@/app/api/paymentApi';
import { DataTable } from '@/app/_components/Table/TableFormat';
import { columns } from "@/app/_components/Table/TransactionColumns/columns"

export default function DiscountDashboard({ params }: { params: { slug: string } }) {
    const [transactions, settransactions] = useState([])
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState(false)
    const searchParams = useSearchParams()
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const {
        register,
        reset,
        handleSubmit,
        control,
        setError,
        getValues,
        formState: { errors },
    } = useForm<any>()
    const { user } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        async function fetchData() {
            await paymentApi.getTransactionOfTeacher(`847dabbe-af39-4195-87cf-f7a2a6b78162`).then((data: any) => {
                settransactions(data.data)
            })
        }
        fetchData()


    }, [params.slug, change, user.id, page]);


    return (
        <div className='w-full'>
            <div>
                <div className="font-bold text-[#171347] text-lg">Danh sách giao dịch</div>
                <div className="container mx-auto bg-white p-4 rounded-lg mt-4">
                    <DataTable columns={columns} data={transactions} page={page} setPage={setPage} pageCount={pageCount} />
                </div>

            </div>
        </div>

    )
}
