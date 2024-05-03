"use client"

import examApi from "@/app/api/examApi"
import { convertToVietnamTime } from "@/app/helper/FormatFunction"
import { useAppSelector } from "@/redux/store"
import { DocumentIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import PaginateButton from "@/app/_components/Paginate/PaginateButton"

export default function ExamDetail({ params }: { params: { slug: string } }) {
    const [assignments, setAssignments] = useState<any>([])
    const { user } = useAppSelector(state => state.authReducer);


    const [countPaginate, setCountPaginate] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        async function fetchData() {
            if (params.slug)
                examApi.getAssigmnentByExamId(`${user.id}`, params.slug, currentPage).then((data) => {
                    setAssignments(data.data.assignments)
                    setCountPaginate(Math.ceil(data.data.count / 10))
                })
        }
        fetchData()
    }, [currentPage, countPaginate, params.slug, user.id]);

    return (
        <div className="mx-20">
            <div className='w-full'>
                <div className='relative flex'>
                    <div className='p-4 flex-1' >
                        <div className='bg-white rounded-[10px] p-4'>
                            <section className='flex justify-between items-center border-[1px] border-[#ececec] p-3 rounded-lg'>
                                <div className='flex items-center justify-center'>
                                    <div className='p-4 h-[88px] w-[88px] bg-slate-100 rounded-md mr-5 flex justify-center items-center'>
                                        <Image
                                            width={48}
                                            height={32}
                                            src={`/images/exam_icon.png`}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="h-[88px] pr-10">
                                        <div className='text-[#818894] text-2xl'>Đề thi THPT quốc gia môn toán năm 2022-2023</div>
                                        <div className='mt-5'>
                                            <Link href={`/course/learning/${params.slug}/exam/attemp/${params.slug}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Làm bài</Link>
                                        </div>
                                    </div>

                                </div>

                            </section>
                            <div className='mt-10'>
                                <h3 className='font-bold text-lg'>
                                    Tóm tắt kết quả các lần làm bài trước của bạn.
                                </h3>
                                {
                                    assignments?.length === 0 ? <p className='mt-4 text-[#818894]'>Chưa có lần làm bài nào</p> : <div>

                                        <div className='mt-5'>
                                            <div className="relative overflow-x-auto">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th scope="col" className="flex-1 px-6 py-3 text-center">
                                                                STT
                                                            </th>
                                                            <th scope="col" className="w-1/4 px-6 py-3">
                                                                Thời gian hoàn thành
                                                            </th>
                                                            <th scope="col" className="w-1/6 px-6 py-3 text-center">
                                                                Điểm
                                                            </th>
                                                            <th scope="col" className="w-1/3 px-6 py-3 text-center">
                                                                Hoàn thành
                                                            </th>

                                                            <th scope="col" className="w-1/4 px-6 py-3 text-center">
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
                                                                            className="px-6 py-4 flex-1 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                                        >
                                                                            {index + 1}
                                                                        </th>
                                                                        <td className="w-1/3 px-6 py-4">{convertToVietnamTime(assignment.time_end)}</td>
                                                                        <td className="w-1/6 px-6 py-4 text-center">{assignment.score}</td>
                                                                        <td className="w-1/3 px-6 py-4 text-center">
                                                                            {assignment.passed ?
                                                                                <span className="bg-red-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Chưa hoàn thành</span>
                                                                                :
                                                                                <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Hoàn thành</span>}
                                                                        </td>
                                                                        <td className="w-1/4 px-6 py-4 text-center"><Link href={`/course/learning/${params.slug}/exam/result/${assignment.id}`} className='underline text-blue-500'>Xem lại</Link></td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <PaginateButton countPaginate={countPaginate} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                            </div>
                        </div>
                    </div >
                </div>
            </div>
        </div>
    )
}