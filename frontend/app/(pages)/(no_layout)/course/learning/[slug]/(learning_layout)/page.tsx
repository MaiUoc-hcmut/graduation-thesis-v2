"use client"
import Link from 'next/link';
import Image from 'next/image';
import { DocumentIcon, EllipsisHorizontalIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player'
import courseApi from "@/app/api/courseApi"
import TinyMceEditorComment from '@/app/_components/Editor/TinyMceEditorComment'
import parse from 'html-react-parser';
import { formatDateTime, convertTime } from '@/app/helper/FormatFunction';
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useSearchParams } from 'next/navigation';
import { Dropdown } from 'flowbite-react';
import { Button, Modal } from 'flowbite-react';
import SidebarLearning from '@/app/_components/Sidebar/SidebarLearning';
import { ToastContainer, toast } from 'react-toastify';
import examApi from '@/app/api/examApi';
import { HeaderLearning } from '@/app/_components/Header/HeaderLearning'

export default function LearningPage({ params }: { params: { slug: string } }) {
    const searchParams = useSearchParams();
    const [course, setCourse] = useState<any>()
    const initToggle: any = {}
    const playRef = useRef<any>()
    const [toggle, setToggle] = useState(initToggle)
    const [tab, setTab] = useState(0)
    const [content, setContent] = useState('')
    const [topic, setTopic] = useState<any>()
    const [comments, setComments] = useState<any>()
    const [change, setChange] = useState(false)
    const [paginate, setPaginate] = useState(0)
    const [currentPageComment, setCurrentPageComment] = useState(1)
    const list = []
    const { user } = useAppSelector(state => state.authReducer);
    const [modal, setModal] = useState<any>({})
    const editorRef = useRef<any>(null);
    const [assignments, setAssignments] = useState<any>()
    const [progress, setProgress] = useState<any>()
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const lectureId = searchParams.get('lecture') || topic?.type === "lecture" ? topic?.id : null
    const examId = searchParams.get('exam') || topic?.type === "exam" ? topic?.id : null
    const topicId = lectureId || examId;

    for (let i = 1; i <= paginate; i++) {
        list.push(i)
    }


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
            await courseApi.getProgress(`${user?.id}`, params.slug).then((data: any) => {
                setProgress(data.data)
            }
            )
        }
        fetchData()
    }, [params.slug, user?.id, change]);

    useEffect(() => {
        async function fetchData() {
            if (examId)
                examApi.getAssigmnentByExamId(`${user.id}`, examId).then((data) => {
                    setAssignments(data.data.assignments)
                })
        }
        fetchData()
    }, [examId, user.id]);

    useEffect(() => {
        async function fetchData() {
            if (lectureId)
                await courseApi.getCommentByTopic(lectureId, currentPageComment).then((data: any) => {
                    setComments(data.data)
                    setPaginate(Math.ceil(data.data.count / 10))
                }
                )
        }
        fetchData()
    }, [change, currentPageComment, lectureId]);

    if (lectureId) {
        return (
            <div className='flex relative h-[calc(100vh-85px)] w-full'>
                <ToastContainer />
                <div className='flex-1'>
                    <div className='flex bg-black p-4 h-full'>
                        <div className='w-full rounded-xl'>
                            <div className='flex flex-col h-full'>
                                {
                                    topic?.type == "lecture" ?
                                        <ReactPlayer onEnded={() => {
                                            let flag = false
                                            progress.progress.map((p: any) => {
                                                if (p.id_topic == topicId) {
                                                    flag = true
                                                    return
                                                }
                                            })
                                            if (!flag) {
                                                const formData = {
                                                    data: {
                                                        id_student: user.id,
                                                        id_course: params.slug,
                                                        id_topic: topicId
                                                    }
                                                }

                                                courseApi.createProgress(formData)
                                                setChange(!change)
                                            }

                                        }} width='100%' height='100%' ref={playRef} controls={true} url={`${topic.video ? topic.video : '/'}`} />
                                        : null
                                }

                            </div>
                        </div>
                    </div>
                    <div className=' overflow-auto'>

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
                                                src={`${user?.avatar ? user?.avatar : '/images/avatar.png'}`}
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <form onSubmit={handleSubmit(async (data) => {
                                                if (data['content'] != '') {
                                                    const formData = {
                                                        data: {
                                                            id_topic: topicId,
                                                            content: data['content'],
                                                        }
                                                    }
                                                    await courseApi.createComment(formData)
                                                    reset()
                                                    editorRef.current.setContent('')
                                                    setChange(!change)
                                                }
                                            })}>
                                                <div className={`${toggle[`edit-cmt`] ? 'hidden' : ''}`}>
                                                    <input onFocus={() => {
                                                        setToggle({ ...toggle, [`edit-cmt`]: !toggle[`edit-cmt`] })
                                                    }} type="text" className="bg-gray-50 border-b border-[#ccc] mb-2 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Bạn có thắc mắc gì trong bài học này?" />
                                                </div>
                                                <div className={`${toggle[`edit-cmt`] ? '' : 'hidden'}`}>
                                                    <TinyMceEditorComment value={content} setValue={setValue} position={'content'} editorRef={editorRef} />
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
                                    <p className='font-medium text-lg mb-10'>{comments?.count} bình luận</p>

                                    {
                                        comments?.comments?.map((cmt: any) => {
                                            return (
                                                <div key={cmt.id} className='mt-5' >
                                                    <>
                                                        <Modal show={modal[`delete-comment${cmt.id}`] || false} size="md" onClose={() => setModal({ ...modal, [`delete-comment${cmt.id}`]: false })} popup>
                                                            <Modal.Header />
                                                            <Modal.Body>
                                                                <form className="space-y-6" onSubmit={async (e) => {
                                                                    e.preventDefault()
                                                                    await courseApi.deleteComment(cmt.id).then(() => {
                                                                        toast.success('Xóa bình luận thành công', {
                                                                            position: "bottom-right",
                                                                            autoClose: 800,
                                                                            hideProgressBar: false,
                                                                            closeOnClick: true,
                                                                            pauseOnHover: true,
                                                                            draggable: true,
                                                                            progress: undefined,
                                                                            theme: "colored",
                                                                        });
                                                                    })
                                                                    setChange(!change)
                                                                    setModal(false)
                                                                }}>
                                                                    <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                                    <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                                                        Bạn có chắc muốn xóa bình luận này?
                                                                    </h3>
                                                                    <div className="flex justify-center gap-4">
                                                                        <Button color="failure" type='submit'>
                                                                            Xóa
                                                                        </Button>
                                                                        <Button color="gray" onClick={() => {
                                                                            setModal({ ...modal, [`delete-comment${cmt.id}`]: false })
                                                                        }}>
                                                                            Hủy
                                                                        </Button>
                                                                    </div>
                                                                </form>
                                                            </Modal.Body>
                                                        </Modal>
                                                    </>

                                                    <div className='flex mb-2'>
                                                        <div className=''>
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={`${cmt.user.avatar ? cmt.user.avatar : '/images/avatar.png'}`}
                                                                alt="avatar"
                                                                className='rounded-full'
                                                            />
                                                        </div>
                                                        <div className='mx-2'>
                                                            <div className='w-full'>
                                                                <div className='bg-[#f2f3f5] rounded-xl'>
                                                                    <div className='p-3'>
                                                                        <div className='flex items-center justify-between'>
                                                                            <div className='flex items-center justify-center'>
                                                                                <p className='mr-2 text-[#184983] font-medium'>{cmt.id_user === user.id ? 'Tôi' : cmt.user.name}</p>
                                                                                {
                                                                                    cmt.user.role == "teacher" ? <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">Giáo viên</span> : null
                                                                                }
                                                                                <p className='text-[#828282] text-sm mr-2'>{formatDateTime(cmt.createdAt)}</p>
                                                                            </div>
                                                                            {
                                                                                cmt.id_user === user.id ? <div className='flex'>
                                                                                    <button className='text-red-500 text-sm mr- 2' onClick={() => setModal({ ...modal, [`delete-comment${cmt.id}`]: true })}>Xóa</button>
                                                                                </div> : null
                                                                            }

                                                                        </div>
                                                                        <div>
                                                                            <div className='mt-2 max-w-3xl min-w-80'>{parse(cmt.content)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='flex items-center justify-start mt-2 mb-5'>
                                                                    <button className='text-black underline hover:text-slate-800 text-md mr-2' onClick={() => {
                                                                        setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: !toggle[`edit-cmt${cmt.id}`] })
                                                                    }}>
                                                                        {cmt.replies?.length || 0} phản hồi
                                                                    </button>
                                                                    <button type='button' className='text-blue-600 hover:text-blue-800 text-md ' onClick={() => {
                                                                        setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: true })
                                                                    }}>Trả lời</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`ml-32 w-4/5 mt-2 ${toggle[`edit-cmt${cmt.id}`] ? '' : 'hidden'}`}>
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
                                                        <div className='mt-5 '>
                                                            {
                                                                cmt.replies.map((reply: any) => {
                                                                    return (
                                                                        <div key={reply.id} className='mt-5' >
                                                                            <div className='flex mb-2'>
                                                                                <div className=''>
                                                                                    <Image
                                                                                        width={50}
                                                                                        height={50}
                                                                                        src={`${cmt.user.avatar ? cmt.user.avatar : '/images/avatar.png'}`}
                                                                                        alt="avatar"
                                                                                        className='rounded-full'
                                                                                    />
                                                                                </div>
                                                                                <div className='mx-2'>
                                                                                    <div className='w-full'>
                                                                                        <div className='bg-[#f2f3f5] rounded-xl'>
                                                                                            <div className='p-3'>
                                                                                                <div className='flex items-center'>
                                                                                                    <p className='mr-2 text-[#184983] font-medium'>{cmt.user.name}</p>
                                                                                                    <p className='text-[#828282] text-sm'>{formatDateTime(reply.createdAt)}</p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <div className='mt-2 max-w-3xl min-w-80'>{parse(reply.content)}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

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
                                            )
                                        })
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
                                                                    <div key={l} onClick={() => setChange(!change)}>
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
    else {
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
                                        <h3 className='text-xl text-secondary font-bold'>{topic?.name}</h3>
                                    </div>

                                </div>
                                <div className='h-1/2'>
                                    <Link href={`attemp/${examId}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Làm bài</Link>
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
                                }

                            </div>
                        </div>
                    </div >
                </div>
            </div>
        )
    }


}
