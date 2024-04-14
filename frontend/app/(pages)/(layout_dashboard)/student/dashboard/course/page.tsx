"use client"

import Image from "next/image"
import Link from "next/link"
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import courseApi from "@/app/api/courseApi"
import { useAppSelector } from "@/redux/store";
import { formatCash } from "@/app/helper/FormatFunction"
import { Dropdown } from 'flowbite-react';
import { ExclamationCircleIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';
import { useSearchParams } from 'next/navigation'

export default function CourseDashboard() {
    const authUser = useAppSelector(state => state.authReducer.user);
    const [courses, setCourses] = useState<any>()
    const [modal, setModal] = useState<any>({})
    const [change, setChange] = useState<boolean>(false)
    const [paginate, setPaginate] = useState(1)
    const list: any = []
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const [searchInput, setSearchInput] = useState('')
    const { user } = useAppSelector(state => state.authReducer);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className={`text-${i <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
                />
            );
        }
        return stars;
    };

    useEffect(() => {
        async function fetchData() {
            await courseApi.studentGetCourse(`${authUser.id}`).then((data: any) => {
                setCourses(data.data.courses)
                setPaginate(Math.ceil(data.data.count / 10))
            })
        }
        fetchData()
    }, [authUser.id, change, page]);

    for (let i = 1; i <= paginate; i++) {
        list.push(i)
    }

    return (
        <div className="">
            <div className="">
                <div className="font-bold text-[#171347] text-lg">Khóa học của tôi</div>
                <div className="flex justify-between items-center mt-10 mb-10 w-full ">
                    <form className="flex items-center w-1/3">
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input onChange={(e: any) => {
                                courseApi.searchCourseByCreateTeacher(`${user.id}`, { query: e.target.value }).then((data: any) => {
                                    setCourses(data.data.result)
                                })
                                setSearchInput(e.target.value)
                            }} type="text" id="simple-search" className="w-full text-sm text-[#343434]  rounded-md border-[1px] border-[#ececec] focus:ring-0 focus:border-primary_border" placeholder="Tìm kiếm trong khóa học" required />
                        </div>
                        <button type="submit" className="ml-2 bg-primary p-2.5 rounded-md shadow-primary_btn_shadow border-primary text-white hover:bg-primary_hover">
                            <MagnifyingGlassIcon className='w-4 h-4' />
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                </div>

            </div>
            <div className="mt-8">
                {
                    courses?.map((data: any) => {
                        const course = data.Course
                        return (
                            <Link key={course?.id} href={`/course/learning/${course?.id}`}>
                                <div className="relative rounded-[10px] flex bg-white mb-8">

                                    <div className="h-[200px] w-[300px] relative">
                                        <Image
                                            src={`${course?.thumbnail ? course?.thumbnail : '/images/cousre-thumnail-1.jpg'}`}
                                            fill
                                            alt="logo"
                                            className="rounded-l-[10px] h-full w-full overflow-hidden object-center object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                                        <div className="flex justify-between items-center w-full">
                                            <h3 className="text-[#171347] font-bold text-lg">
                                                {course?.name}
                                            </h3>

                                            {/* <Dropdown label="" renderTrigger={() => <EllipsisVerticalIcon className="w-7 h-7" />} placement="left">
                                                <Dropdown.Item><Link href={`/course/learning/${course?.id}`}>Đến trang học</Link></Dropdown.Item>
                                            </Dropdown> */}
                                        </div>
                                        <div className="flex items-center mt-4">
                                            {
                                                renderStars(Math.floor(course?.average_rating || 0))
                                            }
                                            <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{course?.average_rating.toFixed(1)}</span>
                                        </div>

                                        <div className="mt-4">
                                            <span className="text-[20px] font-bold text-primary">{formatCash(`${course?.price}`)} VNĐ</span>
                                        </div>
                                        <div className='flex items-center mt-4 '>
                                            <div className='w-[400px]'>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                    <div className="bg-yellow-300 h-2.5 rounded-full" style={{ width: `10%` }} />
                                                </div>
                                            </div>
                                            <span className='ml-3 font-medium text-[#818894]'>Hoàn thành {'10%'}</span>
                                        </div>
                                        <div className="mt-2">
                                            Giáo viên giảng dạy: <span className="font-semibold">Lê Văn A</span>
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        )
                    })
                }
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
    )
}
