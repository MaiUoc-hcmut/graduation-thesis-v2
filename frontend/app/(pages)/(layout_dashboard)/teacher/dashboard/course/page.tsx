"use client"

import Image from "next/image"
import Link from "next/link"
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import courseApi from "@/app/api/courseApi"
import { useAppSelector } from "@/redux/store";
import { formatCash } from "@/app/helper/FormatFunction"
import { Dropdown } from 'flowbite-react';
import { ExclamationCircleIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';
import { useSearchParams } from 'next/navigation'
type CourseData = {
    id: string
    name: string
    subject: string
    grade: string
    level: string
    goal: string
    object: string
    description: string
    requirement: string
    price: string
    thumbnail: Array<File>
    cover_image: Array<File>
}

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
            await courseApi.getAllByTeacher(`${authUser.id}`, page || '1').then((data: any) => {
                setCourses(data.data.courses)
                setPaginate(Math.ceil(data.data.count / 10))
            }).catch((err: any) => { })
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
                    <form className="flex items-center w-1/3"
                        onSubmit={async (e: any) => {
                            e.preventDefault()
                            await courseApi.searchCourseByCreateTeacher(`${user.id}`, { query: searchInput }).then((data: any) => {
                                setCourses(data.data.result)
                            }).catch((err: any) => { })
                        }}
                    >
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input onChange={async (e: any) => {
                                setSearchInput(e.target.value)
                            }} type="text" id="simple-search" className="w-full text-sm text-[#343434]  rounded-md border-[1px] border-[#ececec] focus:ring-0 focus:border-primary_border" placeholder="Tìm kiếm khóa học" />
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
                    courses?.map((course: any) => {
                        return (
                            <div key={course.id} className="relative rounded-[10px] flex bg-white mb-8">
                                <>
                                    <Modal show={modal[`delete-course${course.id}`] || false} size="md" onClose={() => setModal({ ...modal, [`delete-course${course.id}`]: false })} popup>
                                        <Modal.Header />
                                        <Modal.Body>
                                            <form className="space-y-6" onSubmit={async (e) => {
                                                e.preventDefault()
                                                await courseApi.delete(course.id).catch((err: any) => { })
                                                setChange(!change)
                                                setModal(false)
                                            }}>
                                                <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                                    Bạn có chắc muốn xóa khóa học này?
                                                </h3>
                                                <div className="flex justify-center gap-4">
                                                    <Button color="failure" type='submit'>
                                                        Xóa
                                                    </Button>
                                                    <Button color="gray" onClick={() => {
                                                        setModal({ ...modal, [`delete-course${course.id}`]: false })
                                                    }}>
                                                        Hủy
                                                    </Button>
                                                </div>
                                            </form>
                                        </Modal.Body>
                                    </Modal>
                                </>

                                <div className="h-[200px] w-[300px] relative">
                                    <Image
                                        src={`${course.thumbnail ? course.thumbnail : '/images/cousre-thumnail-1.jpg'}`}
                                        fill
                                        alt="logo"
                                        className="rounded-l-[10px] h-full w-full overflow-hidden object-center object-cover"
                                    />
                                </div>
                                <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                                    <div className="flex justify-between items-center w-full">
                                        <Link href="#" >
                                            <h3 className="text-[#171347] font-bold text-lg">
                                                {course.name}
                                            </h3>
                                        </Link>

                                        <Dropdown label="" renderTrigger={() => <EllipsisVerticalIcon className="w-7 h-7" />} placement="left">
                                            <Dropdown.Item onClick={() => {

                                            }}>
                                                <Link href={`course/edit/${course.id}`} >
                                                    Sửa khóa học
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item><Link href={`/course/learning/${course.id}`}>Đến trang học</Link></Dropdown.Item>
                                            <Dropdown.Item><div className="text-red-600" onClick={() => setModal({ ...modal, [`delete-course${course.id}`]: true })}>Xóa khóa học</div></Dropdown.Item>
                                        </Dropdown>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        {
                                            renderStars(Math.floor(course?.average_rating || 0))
                                        }
                                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{course.average_rating.toFixed(1)}</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-[20px] font-bold text-primary">{formatCash(`${course.price}`)} VNĐ</span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between flex-wrap">
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Lớp:</span>
                                            <span className="text-sm text-[#171347]">{course.Categories[0]?.Class}</span>
                                        </div>
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Môn học:</span>
                                            <span className="text-sm text-[#171347]">{course.Categories[1]?.Subject}</span>
                                        </div>
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Mức độ:</span>
                                            <span className="text-sm text-[#171347]">{course.Categories[2]?.Level}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* <div
                                    role="status"
                                    className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div> */}
                            </div>
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
