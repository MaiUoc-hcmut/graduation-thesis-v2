"use client"
import Link from 'next/link';
import Image from 'next/image';
import { DocumentIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import examApi from '@/app/api/examApi';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";
import { formatDateTime } from '@/app/helper/FormatFunction';
import { HeaderLearning } from '@/app/_components/Header/HeaderLearning'


type AnswerData = {
    content: [string],
    file: File
}
export default function TopicPage({ params }: { params: { slug: string, id_exam: string } }) {
    const [assignments, setAssignments] = useState<any>()
    const [toggle, setToggle] = useState<any>({})
    const { user } = useAppSelector(state => state.authReducer);


    useEffect(() => {
        async function fetchData() {
            examApi.getAssigmnentByExamId(`${user.id}`, '1').then((data) => {
                setAssignments(data.data.assignments)
            })
        }
        fetchData()


    }, []);

    return (
        <div className=''>
            <HeaderLearning params={params} />
            <div className='relative flex w-[calc(100%-373px)] mt-24'>
                <div className='p-4 flex-1 ' >
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
                <div className='w-[373px] min-w-[373px] mt-24 h-full fixed right-0 top-0 border-l-[1px] shadow-sm border-[#f1f1f1]'>
                    <div className='text-left text-lg font-bold mx-4 py-2 mt-2 border-b-[1px] border-[#f1f1f1]'>
                        Nội dung
                    </div>
                    <div className='overflow-auto h-[400px] sidebar_learning'>
                        <div className=''>
                            <div className='p-4'>

                                {/* {
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
                                                                | {convertTime(chapter.totalDuration)}
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
                                                                    <div onClick={() => {
                                                                        setLink(topic.video)
                                                                        setTopicId(topic.id)
                                                                        setTopic(topic)
                                                                    }} key={topic.id} className={`${topicId == topic.id ? 'bg-[#f1f1f1]' : 'bg-white'} px-2 py-2 mb-1 cursor-pointer flex items-center`}>
                                                                        <span className='mr-3 bg-[#ececec] w-10 h-10 rounded-full flex justify-center items-center'>
                                                                            <FilmIcon className='w-4 h-4' />
                                                                        </span>
                                                                        <div className='flex flex-col w-2/3'>
                                                                            <span className='font-medium text-[#171347] text-ellipsis overflow-hidden whitespace-nowrap'>{topic.name}</span>
                                                                            <span className='text-[#818894] text-xs'>{convertTime(topic.duration)}</span>
                                                                        </div>
                                                                        {progress?.progress.map((pro: any) => {
                                                                            if (pro.id_topic === topic.id) {
                                                                                return (
                                                                                    <div key={topic.id} className='ml-2'>
                                                                                        <span className='bg-white w-6 h-6 rounded-full flex justify-center items-center'>

                                                                                            <CheckIcon className='w-5 h-4 text-primary' />

                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        })}

                                                                    </div>
                                                                )
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            } */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
