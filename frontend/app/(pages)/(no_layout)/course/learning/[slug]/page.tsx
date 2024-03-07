"use client"
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon, Squares2X2Icon, FilmIcon, CheckIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player'
import courseApi from "@/app/api/courseApi"
import { ReactQuillEditorComment } from '@/app/_components/Editor/ReactQuillEditorComment'
import parse from 'html-react-parser';
import { formatDateTime, convertTime } from '@/app/helper/FormatFunction';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";

export default function LearningPage({ params }: { params: { slug: string } }) {
    const [course, setCourse] = useState<any>()
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const [tab, setTab] = useState(0)
    const [link, setLink] = useState(0)
    const [content, setContent] = useState('')
    const [topicId, setTopicId] = useState('')
    const [topic, setTopic] = useState()
    const [comments, setComments] = useState<[any]>()
    const [progress, setProgress] = useState<[any]>()
    const [change, setChange] = useState(false)
    const { user } = useAppSelector(state => state.authReducer);
    const playerRef = useRef();
    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => {
                setCourse(data.data)
                setLink(data.data.chapters[0]?.topics[0]?.video)
                setTopicId(data.data.chapters[0]?.topics[0]?.id)
                setTopic(data.data.chapters[0]?.topics[0])
            }
            )

            await courseApi.getProgress(user.id, params.slug).then((data: any) => {
                setProgress(data.data)
            }
            )
        }
        fetchData()


    }, [params.slug]);

    useEffect(() => {
        async function fetchData() {
            if (topicId != '') {
                await courseApi.getCommentByTopic(topicId).then((data: any) => {
                    setComments(data.data)
                }
                )
            }

        }
        fetchData()
    }, [topicId, change]);
    comments?.sort(function (a: any, b: any) { return Date.parse(b.createdAt) - Date.parse(a.createdAt) })
    console.log(course, comments, progress, topic);



    return (
        <div className="">

            <div className='flex relative h-[calc(100vh-85px)] w-[calc(100%-373px)]  mt-24'>
                <div className='flex-1'>
                    <div className='flex bg-black p-4 h-full'>
                        <div className='w-full rounded-xl'>
                            <div className='flex flex-col h-full'>
                                <ReactPlayer onEnded={() => {
                                    const formData = {
                                        data: {
                                            id_student: user.id,
                                            id_course: params.slug,
                                            id_topic: topicId
                                        }
                                    }
                                    courseApi.createProgress(formData)

                                }} ref={playerRef} width='100%' height='100%' controls={true} url={`${link ? link : '/'}`} />
                            </div>
                        </div>
                    </div>
                    <div className=' overflow-auto'>
                        <button onClick={() => {
                            playerRef.current.seekTo(50)
                        }}>
                            dsf
                        </button>
                        <div className='px-10 mt-5'>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li className="me-2">
                                    <button
                                        type='button'
                                        onClick={() => setTab(0)}
                                        className={`${tab === 0 ? 'text-blue-600 bg-gray-100 active' : 'hover:text-gray-600 hover:bg-gray-50'} inline-block p-4 px-8 rounded-t-lg `}
                                    >
                                        Bình luận
                                    </button>
                                </li>
                                <li className="me-2">
                                    <button
                                        type='button'
                                        onClick={() => setTab(1)}
                                        className={`${tab === 1 ? 'text-blue-600 bg-gray-100 active' : 'hover:text-gray-600 hover:bg-gray-50'} inline-block p-4 px-8 rounded-t-lg `}
                                    >
                                        Tài liệu
                                    </button>

                                </li>
                            </ul>

                        </div>
                        <div>
                            <div className={`${tab === 0 ? '' : 'hidden'} p-10`}>
                                <p className='font-medium text-xl mb-5'>Bình luận của học sinh</p>
                                <div>
                                    <div className='flex'>
                                        <div className='mr-4'>
                                            <Image
                                                width={45}
                                                height={45}
                                                src="/images/avatar.png"
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className='flex-1 mr-4'>
                                            <form onSubmit={async (e) => {
                                                e.preventDefault()
                                                const formData = {
                                                    data: {
                                                        id_topic: topicId,
                                                        content: content,
                                                    }
                                                }
                                                await courseApi.createComment(formData)
                                                setContent('')
                                                setChange(!change)
                                            }}>
                                                <div className={`${toggle[`edit-cmt`] ? 'hidden' : ''}`}>
                                                    <input onFocus={() => {
                                                        setToggle({ ...toggle, [`edit-cmt`]: !toggle[`edit-cmt`] })
                                                    }} type="text" className="bg-gray-50 border-b border-b-[#ccc] mb-2 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Bạn có thắc mắc gì trong bài học này?" />
                                                </div>
                                                <div className={`${toggle[`edit-cmt`] ? '' : 'hidden'}`}>
                                                    <ReactQuillEditorComment value={content} setValue={setContent} />
                                                </div>
                                                <div className='flex justify-end mt-4'>
                                                    <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => (setToggle({ ...toggle, [`edit-cmt`]: !toggle[`edit-cmt`] }))}>Hủy</button>
                                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Bình luận</button>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                                <div className='mt-10  '>
                                    <p className='font-medium text-lg mb-10'>{comments?.length} bình luận</p>

                                    {
                                        comments?.map((cmt) => {
                                            return (
                                                <div key={cmt.id} className='' >
                                                    <div className='flex mb-2'>
                                                        <div className=''>
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src="/images/avatar.png"
                                                                alt="avatar"
                                                                className='rounded-full'
                                                            />
                                                        </div>
                                                        <div className=' mx-5'>

                                                            <div className='bg-[#f2f3f5] rounded-xl'>
                                                                <div className='p-3'>
                                                                    <div className='flex items-center'>
                                                                        <p className='mr-2 text-[#184983] font-medium'>Mai Nguyện Ước:</p>
                                                                        <p className='text-[#828282] text-sm'>{formatDateTime(cmt.createdAt)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <div className='mt-2 max-w-3xl min-w-75'>{parse(cmt.content)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='mt-2'>
                                                                <button type='button' className='text-blue-600 hover:text-blue-800' onClick={() => {
                                                                    setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: !toggle[`edit-cmt${cmt.id}`] })
                                                                }}>Trả lời</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`ml-30 w-4/5 ${toggle[`edit-cmt${cmt.id}`] ? '' : 'hidden'}`}>
                                                        <form className=''>
                                                            <div className='mt-3'>

                                                            </div>
                                                            <div className='flex justify-end mt-4'>
                                                                <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => (setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: !toggle[`edit-cmt${cmt.id}`] }))}>Hủy</button>
                                                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Bình luân</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                            </div>
                            <div className={`${tab === 1 ? '' : 'hidden'} px-10`}>
                                {
                                    topic?.Documents?.map((document: any) => {
                                        return (
                                            <div className='py-2' key={document.id}>
                                                <Link
                                                    target='_blank'
                                                    href={document.url}
                                                >
                                                    <button className='py-2 underline'>{document.name}</button>
                                                </Link>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                </div>
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
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}
