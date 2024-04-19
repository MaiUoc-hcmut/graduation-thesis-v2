"use client"
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { EllipsisHorizontalIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form"
import { Label, Modal, TextInput, Textarea, Button } from 'flowbite-react';
import courseApi from '@/app/api/courseApi';
import parse from 'html-react-parser';
import { formatDateTime } from '@/app/helper/FormatFunction';
import { useSearchParams } from 'next/navigation';
import { Dropdown } from 'flowbite-react';
import { useAppSelector } from '@/redux/store';


type TopicData = {
    title: string,
    description: string
    file: File
}

export default function ForumPage({ params }: { params: { slug: string } }) {
    const [forum, setForum] = useState<any>()
    const [topics, setTopics] = useState<any>()
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState(false)
    const [content, setContent] = useState<any>('')
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const [paginate, setPaginate] = useState(1)
    const list: any = []
    const { user } = useAppSelector(state => state.authReducer);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<TopicData>()

    useEffect(() => {
        async function fetchData() {
            await courseApi.getForumOfCourse(params.slug, 1).then((data: any) => {
                setForum(data.data)
                setTopics(data.data.topics)
            }
            )

        }
        fetchData()


    }, [params.slug, change]);

    for (let i = 1; i <= paginate; i++) {
        list.push(i)
    }
    return (
        <div className='w-full'>
            <>
                <Modal show={modal[`add-topic`] || false} size="xl" onClose={() => setModal({ ...modal, [`add-topic`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (data: any) => {
                            if (!(Object.entries(errors).length === 0)) return
                            const formData = {
                                data: {
                                    id_forum: forum.id,
                                    title: data.title,
                                    description: data.description,
                                },
                                file: data.file[0]
                            }
                            await courseApi.createTopicForum(formData)
                            setChange(!change)
                            reset()
                            setModal({ ...modal, [`add-topic`]: false })
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm chủ đề</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="title" value="Tiêu đề" />
                                </div>
                                <TextInput
                                    type="text"
                                    {...register('title', {
                                        required: "Tiêu đề không thể thiếu"
                                    })}
                                />
                                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.title?.message}
                                </div>
                            </div>
                            <div className='mt-2'>
                                <div className="mb-2 block">
                                    <Label htmlFor="description" value="Mô tả" />
                                </div>
                                <Textarea rows={4} {...register('description')} />
                            </div>
                            <div className='mt-2 '>
                                <div className="mb-2 block">
                                    <Label htmlFor="file" value="Gắn kèm file (tùy chọn)" />
                                </div>
                                <input  {...register('file')} className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file" type="file" />
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`add-topic`]: false })
                                        reset()
                                    }
                                    }
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <div>
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Đăng
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
            <div className='bg-[#f7fafd] p-4' >
                <div className='bg-white rounded-[10px] p-4'>
                    <section className='rounded-lg border-[1px] border-[#ececec] p-3'>
                        <div className='text-[#818894]'>
                            <div className='flex items-center px-4 bg-[#f7fafd] rounded-lg'>
                                <div className='w-2/5  p-3 rounded-lg'>
                                    <h3 className='font-bold text-[#171347]'>
                                        Thảo luận khóa học
                                    </h3>
                                    <span className='text-[#818894] font-bold mt-2 text-xs'>
                                        Hãy đặt những câu hỏi về khóa học ở đây!
                                    </span>
                                </div>
                                <div className='w-2/5 flex justify-center'>
                                    <form className="flex items-center max-w-sm mx-auto w-full" onSubmit={async (e) => {
                                        e.preventDefault()

                                    }}>
                                        <label htmlFor="simple-search" className="sr-only">Search</label>
                                        <div className="relative w-full">
                                            <input onChange={async (e) => {
                                                // setContent(e.target.value)
                                                if (e.target.value != '') {
                                                    await courseApi.searchForum(forum?.id, {
                                                        query: e.target.value
                                                    }).then((data: any) => {
                                                        setTopics(data.data.result)
                                                    }
                                                    )
                                                }
                                                else {
                                                    setTopics(forum?.topics)
                                                }
                                            }} type="text" id="simple-search" className="w-full text-sm text-[#343434]  rounded-md border-[1px] border-[#ececec] focus:ring-0 focus:border-primary_border" placeholder="Tìm trong phần thảo luận này" />
                                        </div>
                                        {/* <button type="submit" className="ml-2 bg-primary p-2.5 rounded-md shadow-primary_btn_shadow border-primary text-white hover:bg-primary_hover">
                                            <MagnifyingGlassIcon className='w-4 h-4' />
                                            <span className="sr-only">Search</span>
                                        </button> */}
                                    </form>
                                </div>
                                <div className='w-1/5 flex items-center justify-end'>
                                    <button className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover' onClick={() => setModal({ ...modal, [`add-topic`]: true })}>Tạo chủ đề</button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className='mt-5'>
                        {topics?.map((topic: any, index: any) => {
                            return (
                                <div key={topic.id} className='mb-6 rounded-lg border-[1px] border-[#ececec] p-4 flex w-full'>
                                    <>
                                        <Modal show={modal[`delete-topic${topic.id}`] || false} size="md" onClose={() => setModal({ ...modal, [`delete-topic${topic.id}`]: false })} popup>
                                            <Modal.Header />
                                            <Modal.Body>
                                                <form className="space-y-6" onSubmit={async (e) => {
                                                    // e.preventDefault()
                                                    // await courseApi.delete(course.id)
                                                    // setChange(!change)
                                                    // setModal(false)
                                                }}>
                                                    <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                    <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                                        Bạn có chắc muốn xóa chủ đề này?
                                                    </h3>
                                                    <div className="flex justify-center gap-4">
                                                        <Button color="failure" type='submit'>
                                                            Xóa
                                                        </Button>
                                                        <Button color="gray" onClick={() => {
                                                            setModal({ ...modal, [`delete-topic${topic.id}`]: false })
                                                        }}>
                                                            Hủy
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Modal.Body>
                                        </Modal>
                                        <Modal show={modal[`edit-topic${topic.id}`] || false} size="xl" onClose={() => setModal({ ...modal, [`edit-topic${topic.id}`]: false })} popup>
                                            <Modal.Header />
                                            <Modal.Body>
                                                <form className="space-y-6" onSubmit={handleSubmit(async (data: any) => {
                                                    if (!(Object.entries(errors).length === 0)) return
                                                    const formData = {
                                                        data: {
                                                            id_forum: forum.id,
                                                            title: data.title,
                                                            description: data.description,
                                                        },
                                                        file: data.file[0]
                                                    }
                                                    await courseApi.createTopicForum(formData)
                                                    setChange(!change)
                                                    reset()
                                                    setModal({ ...modal, [`add-topic`]: false })
                                                })}>

                                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm chủ đề</h3>
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label htmlFor="title" value="Tiêu đề" />
                                                        </div>
                                                        <TextInput
                                                            type="text"
                                                            defaultValue={topic.title}
                                                            {...register('title', {
                                                                required: "Tiêu đề không thể thiếu"
                                                            })}
                                                        />
                                                        <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                            {errors?.title?.message}
                                                        </div>
                                                    </div>
                                                    <div className='mt-2'>
                                                        <div className="mb-2 block">
                                                            <Label htmlFor="description" value="Mô tả" />
                                                        </div>
                                                        <Textarea rows={4}  {...register('description')} defaultValue={topic.description} />
                                                    </div>
                                                    <div className='mt-2 '>
                                                        <div className="mb-2 block">
                                                            <Label htmlFor="file" value="Gắn kèm file (tùy chọn)" />
                                                        </div>
                                                        <input  {...register('file')} className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file" type="file" />
                                                    </div>
                                                    <div className="mt-6 flex justify-end">
                                                        <button
                                                            onClick={() => {
                                                                setModal({ ...modal, [`edit-topic${topic.id}`]: false })
                                                                reset()
                                                            }
                                                            }
                                                            type="button"
                                                            className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <div>
                                                            <button
                                                                type="submit"
                                                                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            >
                                                                Lưu
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Modal.Body>
                                        </Modal>
                                    </>
                                    <div className='flex w-full'>
                                        <div className='flex-1 bg-[#f7fafd] p-4 rounded-lg'>
                                            <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                                <div className='p-[6px] bg-white rounded-full'>
                                                    <Image
                                                        src={`${topic.user?.avatar ? topic.user?.avatar : '/images/avatar.png'}`}
                                                        width={80}
                                                        height={80}
                                                        className='rounded-full'
                                                        alt="logo"
                                                    />
                                                </div>
                                                <div className='text-center mt-4 flex flex-col items-center'>
                                                    <span className=' text-secondary font-bold'>
                                                        {topic.user?.name}
                                                    </span>
                                                    <span className='text-[#818894] text-[0.75rem] mt-2]'>{topic.user?.role == "teacher" ? "Giáo viên" : "Học sinh"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='ml-5 w-4/6 '>
                                            <Link href={`/course/learning/${params.slug}/forum/${topic.id}`}>
                                                <h3 className='text-[#171347] font-bold'>{topic.title}</h3>
                                            </Link>
                                            <p className='mt-2 text-[#818894] text-sm'>{parse(topic.description)}</p>
                                        </div>
                                        <div className='w-1/6 flex flex-col justify-between items-end'>
                                            <div className='flex justify-center items-center'>
                                                <div className='text-[#818894] mr-2 text-sm'>{formatDateTime(topic.createdAt)}</div>
                                                {
                                                    topic?.id_user === user.id ? <Dropdown label="" renderTrigger={() => <EllipsisHorizontalIcon className="w-7 h-7" />} placement="left">
                                                        <Dropdown.Item onClick={() => {

                                                        }}>
                                                            <button onClick={() => setModal({ ...modal, [`edit-topic${topic.id}`]: true })}>Sửa</button>

                                                        </Dropdown.Item>
                                                        <Dropdown.Item><button type="button" className="text-red-600" onClick={() => setModal({ ...modal, [`delete-topic${topic.id}`]: true })}>Xóa</button></Dropdown.Item>
                                                    </Dropdown> : null
                                                }

                                            </div>
                                            <div className='text-[#818894] text-sm'>Số câu trả lời : {topic.total_answer}</div>
                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    {
                        paginate > 1 ?
                            <div className="flex justify-center items-center pt-10 pb-5">
                                <nav aria-label="Page navigation example">
                                    <ul className="flex items-center -space-x-px h-8 text-sm">
                                        <li>
                                            <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                <span className="sr-only">Previous</span>
                                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 1 1 5l4 4" />
                                                </svg>
                                            </a>
                                        </li>
                                        {
                                            list.map((l: number) => {
                                                return (
                                                    <div key={l} onClick={() => setChange(!change)}>
                                                        <li>
                                                            <Link href={`course?page=${l}`} className={`flex items-center justify-center px-3 h-8 leading-tight ${page == `${l}` ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} `}>{l}</Link>
                                                        </li>

                                                    </div>
                                                )
                                            })
                                        }
                                        <li>
                                            <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                <span className="sr-only">Next</span>
                                                <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                                                </svg>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div> : null
                    }
                </div>
            </div >
        </div>

    )
}
