"use client"

import examApi from "@/app/api/examApi"
import { convertToVietnamTime } from "@/app/helper/FormatFunction"
import { useAppSelector } from "@/redux/store"
import { ChevronDownIcon, ChevronUpIcon, DocumentIcon, Squares2X2Icon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"
import { HeaderLearning } from "@/app/_components/Header/HeaderLearning"
import SidebarLearning from "@/app/_components/Sidebar/SidebarLearning"
import courseApi from "@/app/api/courseApi"

export default function ExamDetail({ params }: { params: { slug: string } }) {
    const [assignments, setAssignments] = useState<any>([])
    const { user } = useAppSelector(state => state.authReducer);
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)

    const [paginate, setPaginate] = useState(0)
    const [course, setCourse] = useState<any>({})
    const [currentPageComment, setCurrentPageComment] = useState(1)
    let list: any = []

    useEffect(() => {
        async function fetchData() {
            if (params.slug)
                examApi.getAssigmnentByExamId(`${user.id}`, params.slug, currentPageComment).then((data) => {
                    setAssignments(data.data.assignments)
                    setPaginate(Math.ceil(data.data.count / 10))
                })
        }
        fetchData()
    }, [currentPageComment, paginate, params.slug, user.id]);

    for (let i = 1; i <= paginate; i++) {
        list.push(i)
    }

    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => {
                setCourse(data.data)
            }
            ).catch((err: any) => { })
        }
        fetchData()


    }, [params.slug, user?.id]);
    return (
        <div>
            <HeaderLearning params={params} course={{}} progress={[]} />
            <div className="relative flex w-[calc(100%-373px)] mt-24">
                <div className='w-full'>
                    <div className='relative flex'>
                        <div className='p-4 flex-1' >
                            <div className='bg-white rounded-[10px] p-4'>
                                <section className='flex justify-between items-center border-[1px] border-[#ececec] p-3 rounded-lg'>
                                    <div className='flex items-center justify-center'>
                                        <div className='p-4 h-28 w-28 bg-slate-100 rounded-md mr-5 flex justify-center items-center'>
                                            <Image
                                                width={60}
                                                height={48}
                                                src={`/images/exam_icon.png`}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="h-28 pr-10">
                                            <div className='text-[#818894] text-2xl'>Đề thi THPT quốc gia môn toán năm 2022-2023</div>
                                            <div>
                                                <span className="mr-2">
                                                    Thời gian: 60 phút
                                                </span>
                                                <span>
                                                    Số câu: 40
                                                </span>

                                            </div>
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
                                    {
                                        paginate > 1 ?
                                            <div className="flex justify-center items-center pt-10 pb-5">
                                                <nav aria-label="Page navigation example">
                                                    <ul className="flex items-center -space-x-px h-8 text-sm">
                                                        <li>
                                                            <button disabled className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                                <span className="sr-only">Previous</span>
                                                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 1 1 5l4 4" />
                                                                </svg>
                                                            </button>
                                                        </li>
                                                        {
                                                            list.map((l: number) => {
                                                                return (
                                                                    <div key={l}>
                                                                        <button onClick={() => setCurrentPageComment(l)} className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPageComment == l ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} `}>{l}</button>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        <li>
                                                            <button disabled className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                                <span className="sr-only">Next</span>
                                                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                                                                </svg>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div> : null
                                    }
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            </div>
            <>
                <div className='w-[373px] min-w-[373px] mt-24 h-full fixed right-0 top-0 border-l-[1px] shadow-sm border-[#f1f1f1]'>
                    <div className='text-left text-lg font-bold mx-4 py-2 mt-2 border-b-[1px] border-[#f1f1f1]'>
                        Nội dung
                    </div>
                    <div className='overflow-auto h-[400px] sidebar_learning'>
                        <div className=''>
                            <div className='p-4'>

                                {
                                    course?.chapters?.map((chapter: any) => {
                                        return (
                                            <div key={chapter.id} className='mb-3'>

                                                <div className='border-[1px] border-[#f1f1f1] px-2 py-2 rounded-lg'>
                                                    <div className={`flex justify-between items-center ${toggle[`open_chapter_${chapter.id}`] ? 'pb-3' : ''}`}>
                                                        <div className="flex justify-center items-center">
                                                            <span className="flex justify-center items-center w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full mr-[10px]">
                                                                <Squares2X2Icon className="w-6 h-6 text-white" />
                                                            </span>
                                                            <div>
                                                                <span className="font-bold text-[rgb(23,19,71)] text-lg">
                                                                    {chapter.name}
                                                                </span>
                                                                <span className="font-normal text-[818894] text-xs flex">
                                                                    {chapter.topics?.length} chủ đề

                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-5 flex items-center justify-center">
                                                            {
                                                                !toggle[`open_chapter_${chapter.id}`] ?
                                                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                                        setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: true })
                                                                    }}>
                                                                        <ChevronDownIcon className="w-5 h-5" />
                                                                    </button>
                                                                    :
                                                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                                        setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: false })
                                                                    }}>
                                                                        <ChevronUpIcon className="w-5 h-5" />
                                                                    </button>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className={`${toggle[`open_chapter_${chapter.id}`] ? '' : 'hidden'} border-t-[1px] border-[#f1f1f1] pt-4`}>
                                                        <div>
                                                            {
                                                                chapter.topics.map((topic: any) => {

                                                                    return (
                                                                        <Link href={`/course/learning/${123}/?exam=${topic.id_exam}`} key={topic.id} className={`${params.slug == topic.id_exam ? 'bg-[#f1f1f1]' : 'bg-white'} px-2 py-2 mb-1 cursor-pointer flex items-center rounded-sm`}>
                                                                            <span className='mr-3 bg-[#ececec] w-10 h-10 rounded-full flex justify-center items-center'>
                                                                                <DocumentIcon className='w-4 h-4' />
                                                                            </span>
                                                                            <div className='flex flex-col w-2/3'>
                                                                                <span className='font-medium text-[#171347] text-ellipsis overflow-hidden whitespace-nowrap'>{topic.name}</span>
                                                                                <span className='text-[#818894] text-xs'>{topic.exam?.quantity_question} câu</span>
                                                                            </div>

                                                                        </Link>
                                                                    )
                                                                })
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}