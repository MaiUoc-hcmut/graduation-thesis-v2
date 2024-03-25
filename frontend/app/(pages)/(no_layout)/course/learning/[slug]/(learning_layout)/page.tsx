"use client"
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon, Squares2X2Icon, FilmIcon, CheckIcon, DocumentIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player'
import courseApi from "@/app/api/courseApi"
import TinyMceEditorComment from '@/app/_components/Editor/TinyMceEditorComment'
import parse from 'html-react-parser';
import { formatDateTime, convertTime } from '@/app/helper/FormatFunction';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useSearchParams } from 'next/navigation';

export default function LearningPage({ params }: { params: { slug: string } }) {
    const searchParams = useSearchParams();
    const [course, setCourse] = useState<any>()
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const [tab, setTab] = useState(0)
    const [content, setContent] = useState('')
    const [topic, setTopic] = useState<any>()
    const [comments, setComments] = useState<any>()
    const [change, setChange] = useState(false)
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const { user } = useAppSelector(state => state.authReducer);

    const topicId = searchParams.get('lecture');

    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then(async (data: any) => {
                setCourse(data.data)
                setTopic(data.data.chapters[0]?.topics[0])
            }
            )
        }
        fetchData()


    }, [params.slug]);

    useEffect(() => {
        async function fetchData() {
            if (topicId)
                await courseApi.getCommentByTopic(topicId).then((data: any) => {
                    setComments(data.data.comments)
                }
                )
        }
        fetchData()
    }, [topicId, change]);
    // comments?.sort(function (a: any, b: any) { return Date.parse(b.createdAt) - Date.parse(a.createdAt) })


    return (
        <div className='flex relative h-[calc(100vh-85px)] w-full'>
            <div className='flex-1'>
                <div className='flex bg-black p-4 h-full'>
                    <div className='w-full rounded-xl'>
                        <div className='flex flex-col h-full'>
                            {
                                topic?.type == "lecture" ?
                                    <ReactPlayer onEnded={() => {
                                        const formData = {
                                            data: {
                                                id_student: user.id,
                                                id_course: params.slug,
                                                id_topic: topicId
                                            }
                                        }
                                        courseApi.createProgress(formData)

                                    }} width='100%' height='100%' controls={true} url={`${topic.video ? topic.video : '/'}`} />
                                    : null
                            }

                        </div>
                    </div>
                </div>
                <div className=' overflow-auto'>
                    {/* <button onClick={() => {
                                                    playerRef.current.seekTo(50)
                                                }}>
                    
                                                </button> */}
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
                                    <div className='flex-1'>
                                        <form onSubmit={async (e) => {
                                            e.preventDefault()
                                            if (content != '') {
                                                const formData = {
                                                    data: {
                                                        id_topic: topicId,
                                                        content: content,
                                                    }
                                                }
                                                await courseApi.createComment(formData)
                                                setChange(!change)
                                            }
                                            setContent('')
                                        }}>
                                            <div className={`${toggle[`edit-cmt`] ? 'hidden' : ''}`}>
                                                <input onFocus={() => {
                                                    setToggle({ ...toggle, [`edit-cmt`]: !toggle[`edit-cmt`] })
                                                }} type="text" className="bg-gray-50 border-b border-[#ccc] mb-2 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Bạn có thắc mắc gì trong bài học này?" />
                                            </div>
                                            <div className={`${toggle[`edit-cmt`] ? '' : 'hidden'}`}>
                                                <TinyMceEditorComment value={content} setValue={setValue} />
                                            </div>
                                            <div className='flex justify-end mt-4'>
                                                <button type="button" className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200" onClick={() => (setToggle({ ...toggle, [`edit-cmt`]: false }))}>Hủy</button>
                                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">Bình luận</button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                            <div className='mt-10  '>
                                <p className='font-medium text-lg mb-10'>{comments?.length} bình luận</p>

                                {
                                    comments?.map((cmt: any) => {
                                        return (
                                            <div key={cmt.id} className='mt-5' >
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
                                                    <div className='mx-2'>
                                                        <div className='w-full'>
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
                                                            <div className=''>
                                                                <button type='button' className='text-blue-600 hover:text-blue-800 text-xs' onClick={() => {
                                                                    setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: !toggle[`edit-cmt${cmt.id}`] })
                                                                }}>Trả lời</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`ml-[58px] w-4/5 mt-2 ${toggle[`edit-cmt${cmt.id}`] ? '' : 'hidden'}`}>
                                                    <form onSubmit={handleSubmit(async (data) => {
                                                        if (data[cmt.id] != '') {
                                                            const formData = {
                                                                data: {
                                                                    id_topic: topicId,
                                                                    content: data[cmt.id],
                                                                    id_parent: cmt.id
                                                                }
                                                            }
                                                            await courseApi.createComment(formData)
                                                            reset()
                                                            setChange(!change)
                                                        }
                                                    })}>

                                                        <TinyMceEditorComment value={content} setValue={setValue} position={`${cmt.id}`} />
                                                        <div className='flex justify-end mt-4'>
                                                            <button type="button" className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-200" onClick={() => (setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: false }))}>Hủy</button>
                                                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">Bình luận</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>
                        <div className={`${tab === 1 ? '' : 'hidden'} px-10 `}>
                            {topic?.Documents?.length == 0 ? <p className='text-secondary py-5'>Không có tài liệu.</p> :
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
        </div>
    )
}
