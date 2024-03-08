"use client"
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState, useRef } from 'react';
import courseApi from "@/app/api/courseApi"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { AppDispatch, useAppSelector } from "@/redux/store";



type TopicData = {
    title: string,
    description: string
    file: File
}

export default function TopicPage({ params }: { params: { id: string } }) {
    const [topics, setTopics] = useState<any>()
    const [toggle, setToggle] = useState<any>({})

    useEffect(() => {
        async function fetchData() {
            await courseApi.getTopicForum(params.id, 1).then((data: any) => {
                setTopics(data.data)
            }
            )

        }
        fetchData()


    }, [params.slug]);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<TopicData>()
    return (
        <div className=''>
            <div className='bg-[#f7fafd] p-4' >
                <div className='bg-white rounded-[10px] p-4'>
                    <section className='rounded-lg border-[1px] border-[#ececec] p-3 flex flex-col justify-center'>
                        <h3 className='text-xl text-secondary font-bold'>I need help !!!</h3>
                        <span className='mt-2 text-[#818894] text-sm'>By <span className='font-bold'>Cameron Schofield</span> in 22 Jun 2022 | 00:47</span>
                    </section>
                    <div className='mt-5'>
                        {topics?.answers?.map((topic, index) => {
                            return (
                                <div key={index} className='mb-6 rounded-lg border-[1px] border-[#ececec] p-4'>
                                    <div className=' flex w-full border-b-[1px] border-[#ececec] pb-4'>
                                        <div className='flex w-full'>
                                            <div className='flex-1 bg-[#f7fafd] p-4 rounded-lg'>
                                                <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                                    <div className='p-[6px] bg-white rounded-full'>
                                                        <Image
                                                            src="/images/avatar-teacher.png"
                                                            width={80}
                                                            height={80}
                                                            className='rounded-full'
                                                            alt="logo"
                                                        />
                                                    </div>
                                                    <div className='text-center mt-4 flex flex-col items-center'>
                                                        <span className=' text-secondary font-bold'>
                                                            Việt Lê
                                                        </span>
                                                        <span className='text-[#818894] text-[0.75rem] mt-2]'>Học sinh</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='ml-7 w-4/6 '>
                                                <p className='text-[#818894] text-sm'>Hi,
                                                    I need help to complete final part.
                                                    I attached the error screenshot.
                                                    Regards.</p>
                                                <Link href="https://firebasestorage.googleapis.com/v0/b/study365-a3ffe.appspot.com/o/video%20course%2F18b68e145d9c0738b8182485818559f8.mp4%20%20%20%20%20%20%202024-2-28%2010%3A31%3A53?alt=media&token=9246dd71-7e13-4889-876d-433831ea2d52" target='_blank' download className='bg-[#f7fafd] text-sm mt-6 p-1 flex justify-center items-center rounded-xl text-[#818894] w-28'>
                                                    <PaperClipIcon className='w-4 h-4 mr-2' />
                                                    Đính kèm
                                                </Link>
                                            </div>
                                            <div className='w-1/6 flex flex-col justify-between items-end'>
                                                <div className='text-[#818894] text-sm'>22 Jun 2022 | 03:20</div>
                                                <div className='flex text-sm'>
                                                    <span className='mr-4 text-[#818894] underline cursor-pointer' onClick={() => setToggle({ ...toggle, [`edit-cmt`]: true })}>5 phản hồi</span>
                                                    <button className='text-blue-500' onClick={() => setToggle({ ...toggle, [`edit-cmt`]: true })}>Phản hồi</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${toggle[`edit-cmt`] ? '' : 'hidden'} flex justify-end items-center mt-10`}>
                                        <div className='w-5/6'>
                                            <div className='mb-6 flex w-full border-b-[1px] border-[#ececec] pb-6'>
                                                <div className='flex w-full'>
                                                    <div className='flex-1 bg-[#f7fafd] p-2 rounded-lg'>
                                                        <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                                            <div className='p-[6px] bg-white rounded-full'>
                                                                <Image
                                                                    src="/images/avatar-teacher.png"
                                                                    width={60}
                                                                    height={60}
                                                                    className='rounded-full'
                                                                    alt="logo"
                                                                />
                                                            </div>
                                                            <div className='text-center mt-2 flex flex-col items-center'>
                                                                <span className=' text-secondary font-bold'>
                                                                    Việt Lê
                                                                </span>
                                                                <span className='text-[#818894] text-[0.75rem] mt-2]'>Học sinh</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='ml-7 w-4/6 '>
                                                        <p className='text-[#818894] text-sm'>Hi,
                                                            I need help to complete final part.
                                                            I attached the error screenshot.
                                                            Regards.</p>
                                                        <Link href='#' className='bg-[#f7fafd] text-sm mt-6 p-1 flex justify-center items-center rounded-xl text-[#818894] w-28'>
                                                            <PaperClipIcon className='w-4 h-4 mr-2' />
                                                            Đính kèm
                                                        </Link>
                                                    </div>
                                                    <div className='w-1/6 flex flex-col justify-between items-end'>
                                                        <div className='text-[#818894] text-sm'>22 Jun 2022 | 03:20</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mb-6 flex w-full  border-b-[1px] border-[#ececec] pb-6'>
                                                <div className='flex w-full'>
                                                    <div className='flex-1 bg-[#f7fafd] p-2 rounded-lg'>
                                                        <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                                            <div className='p-[6px] bg-white rounded-full'>
                                                                <Image
                                                                    src="/images/avatar-teacher.png"
                                                                    width={60}
                                                                    height={60}
                                                                    className='rounded-full'
                                                                    alt="logo"
                                                                />
                                                            </div>
                                                            <div className='text-center mt-2 flex flex-col items-center'>
                                                                <span className=' text-secondary font-bold'>
                                                                    Việt Lê
                                                                </span>
                                                                <span className='text-[#818894] text-[0.75rem] mt-2]'>Học sinh</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='ml-7 w-4/6 '>
                                                        <p className='text-[#818894] text-sm'>Hi,
                                                            I need help to complete final part.
                                                            I attached the error screenshot.
                                                            Regards.</p>
                                                        <Link href='#' className='bg-[#f7fafd] text-sm mt-6 p-1 flex justify-center items-center rounded-xl text-[#818894] w-28'>
                                                            <PaperClipIcon className='w-4 h-4 mr-2' />
                                                            Đính kèm
                                                        </Link>
                                                    </div>
                                                    <div className='w-1/6 flex flex-col justify-between items-end'>
                                                        <div className='text-[#818894] text-sm'>22 Jun 2022 | 03:20</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex justify-end'>
                                                <button className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover' onClick={() => setToggle({ ...toggle, [`edit-cmt`]: false })}>Đóng</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    <div className='mt-5'>
                        <h3 className='text-secondary font-bold text-xl'>Phản hồi</h3>
                        <div className='mt-6 rounded-lg border-[1px] border-[#ececec] p-4 flex w-full'>
                            <div className='flex w-full'>
                                <div className='flex-1 bg-[#f7fafd] p-4 rounded-lg'>
                                    <div className=' flex-1 flex flex-col justify-center items-center p-2 pt-0'>
                                        <div className='p-[6px] bg-white rounded-full'>
                                            <Image
                                                src="/images/avatar-teacher.png"
                                                width={80}
                                                height={80}
                                                className='rounded-full'
                                                alt="logo"
                                            />
                                        </div>
                                        <div className='text-center mt-4 flex flex-col items-center'>
                                            <span className=' text-secondary font-bold'>
                                                Việt Lê
                                            </span>
                                            <span className='text-[#818894] text-[0.75rem] mt-2]'>Học sinh</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='ml-7 w-5/6 flex flex-col'>
                                    <textarea className='w-full'></textarea>
                                    <div className='flex justify-end mt-4'>
                                        <button className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Đăng</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        </div>

    )
}
