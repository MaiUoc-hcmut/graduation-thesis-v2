"use client"
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import courseApi from "@/app/api/courseApi"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";
import { formatDateTime } from '@/app/helper/FormatFunction';



type AnswerData = {
    content: [string],
    file: File
}
export default function TopicPage({ params }: { params: { id: string } }) {
    const [topic, setTopic] = useState<any>()
    const [toggle, setToggle] = useState<any>({})
    const { user } = useAppSelector(state => state.authReducer);
    const {
        register,
        reset,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm<AnswerData>()

    useEffect(() => {
        async function fetchData() {
            await courseApi.getTopicForum(params.id, 1).then((data: any) => {
                setTopic(data.data)
            }
            )

        }
        fetchData()


    }, [params.id]);

    return (
        <div className=''>
            <div className='bg-[#f7fafd] p-4' >
                <div className='bg-white rounded-[10px] p-4'>
                    <section className='rounded-lg border-[1px] border-[#ececec] p-3 flex flex-col justify-center'>
                        <h3 className='text-xl text-secondary font-bold'>{topic?.title}</h3>
                        <span className='mt-2 text-[#818894] text-sm'>By <span className='font-bold'>Cameron Schofield</span> in {formatDateTime(topic?.createdAt)}</span>
                        <nav className="flex mt-2 text-[#818894]" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link
                                        href="#"
                                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                                    >

                                        Khóa học
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg
                                            className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                        <Link
                                            href="#"
                                            className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                                        >
                                            Thảo luận
                                        </Link>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg
                                            className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                            {topic?.title}
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                    </section>
                    <div className='mt-5'>
                        sfd
                    </div>
                </div>
            </div >
        </div>

    )
}
