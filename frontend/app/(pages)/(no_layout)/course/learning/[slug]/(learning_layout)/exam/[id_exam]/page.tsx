"use client"
import Link from 'next/link';
import { DocumentIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import examApi from '@/app/api/examApi';
import { useAppSelector } from "@/redux/store";

export default function TopicPage({ params }: { params: { slug: string, id_exam: string } }) {
    const [assignments, setAssignments] = useState<any>()
    const { user } = useAppSelector(state => state.authReducer);



    useEffect(() => {
        async function fetchData() {
            examApi.getAssigmnentByExamId(`${user.id}`, params.id_exam).then((data) => {
                setAssignments(data.data.assignments)
            })
        }
        fetchData()
    }, [params.id_exam, user.id]);

    return (
        <div className='w-full'>
            <div className='relative flex'>
                <div className='p-4 flex-1' >
                    <div className='bg-white rounded-[10px] p-4 '>
                        <section className='flex justify-between items-center border-[1px] border-[#ececec] p-3 rounded-lg'>
                            <div className='flex items-center'>
                                <div className='p-4 bg-slate-100 mr-2 rounded-md'>
                                    <DocumentIcon className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className='text-[#818894] text-sm'>BÀI KIỂM TRA</div>
                                    <h3 className='text-xl text-secondary font-bold'>Bộ đề thi Công chức Thuế 2023 - KV miền bắc</h3>
                                </div>

                            </div>
                            <div className='h-1/2'>
                                <Link href={`attemp/${params.id_exam}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Làm bài</Link>
                            </div>

                        </section>
                        <div className='mt-10'>
                            <h3 className='font-bold text-lg mt-8'>
                                Tóm tắt kết quả các lần làm bài trước của bạn.
                            </h3>
                            <div className='mt-5'>
                                <div className="relative overflow-x-auto">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="w-1/6 px-6 py-3 text-center">
                                                    Làm bài
                                                </th>
                                                <th scope="col" className="w-1/2 px-6 py-3">
                                                    Thời gian hoàn thành
                                                </th>
                                                <th scope="col" className="w-1/6 px-6 py-3 text-center">
                                                    Điểm
                                                </th>
                                                <th scope="col" className="w-1/6 px-6 py-3 text-center">
                                                    Xem lại
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                assignments?.map((assignment: any, index: number) => {
                                                    return (
                                                        <tr key={assignment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                            <th
                                                                scope="row"
                                                                className="px-6 py-4 w-1/6 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                            >
                                                                {index + 1}
                                                            </th>
                                                            <td className="w-1/2 px-6 py-4">{assignment.time_end}</td>
                                                            <td className="w/1/6 px-6 py-4 text-center">{assignment.score}</td>
                                                            <td className="w/1/6 px-6 py-4 text-center"><Link href={`result/${assignment.id}`} className='underline text-blue-500'>Xem lại</Link></td>
                                                        </tr>
                                                    )
                                                })
                                            }


                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </div>

    )
}
