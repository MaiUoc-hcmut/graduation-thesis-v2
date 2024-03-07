"use client"

/* eslint-disable react/jsx-no-undef */
import Link from 'next/link';
import Image from 'next/image';
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from 'react';
import courseApi from '@/app/api/courseApi';

export function HeaderLearning({ params }: { params: { slug: string } }) {
    const [course, setCourse] = useState<any>()
    const [progress, setProgress] = useState<any>()
    const { user } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => {
                setCourse(data.data)
            }
            )

            await courseApi.getProgress(`${user?.id}`, params.slug).then((data: any) => {
                setProgress(data.data)
            }
            )
        }
        fetchData()


    }, [params.slug]);
    return (
        <div className="fixed top-0 left-0 h-24 w-full flex z-10 bg-white items-center justify-between px-9 py-4 shadow-sm">
            <div className="flex items-center">
                <div>
                    <Link href="/" className=''>
                        <Image
                            src="/images/logo.png"
                            width={170}
                            height={39}
                            alt="logo"
                        />
                    </Link>
                </div>
                <div className='flex flex-col border-l-[1px] border-[#f1f1f1] ml-3 pl-3'>
                    <div>
                        <span className='font-bold text-[#343434] text-lg'>{course?.name}</span>
                    </div>
                    <div className='flex items-center'>
                        <div className='w-[400px]'>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-yellow-300 h-2.5 rounded-full" style={{ width: `${progress?.percentage}` }} />
                            </div>
                        </div>
                        <span className='ml-3 font-medium text-[#818894]'>Hoàn thành {progress?.percentage}</span>
                    </div>
                </div>
            </div>
            <div className='flex items-center mt-[5px]'>
                <div className='flex items-center'>
                    <Link href={`/course/learning/${params.slug}`} className='bg-white mr-2 text-[#343434] cursor-pointer px-4 py-1 rounded border-[1px] border-[#e3e1e1]'>
                        Trang học
                    </Link>
                    <Link href={`/course/learning/${params.slug}/forum`} className='bg-white mr-2 text-[#343434] cursor-pointer px-4 py-1 rounded border-[1px] border-[#e3e1e1]'>
                        Thảo luận
                    </Link>
                    <Link href={`/course/${params.slug}`} className='bg-white  text-[#343434] cursor-pointer px-4 py-1 rounded border-[1px] border-[#e3e1e1]'>
                        Trang khóa học
                    </Link>

                </div>
            </div>
        </div>
    )
}
