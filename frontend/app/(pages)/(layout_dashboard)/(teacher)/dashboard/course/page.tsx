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
import { ExclamationCircleIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { Button, Modal } from 'flowbite-react';

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
    const [courses, setCourses] = useState<[CourseData]>()
    const [modal, setModal] = useState<boolean>(false)
    useEffect(() => {
        async function fetchCategory() {
            await courseApi.getAllByTeacher(`${authUser.id}`).then((data: any) => setCourses(data.data))
        }
        fetchCategory()
    }, [authUser.id]);

    console.log(courses, authUser);


    return (
        <div className="">




            <div className="">
                <div className="font-bold text-[#171347] text-lg">Khóa học của tôi</div>
            </div>
            <div className="mt-8">
                {
                    courses?.map((course) => {
                        return (
                            <div key={course.id} className="rounded-[10px] flex bg-white mb-8">

                                <>
                                    <Modal show={modal} size="md" onClose={() => setModal(false)} popup>
                                        <Modal.Header />
                                        <Modal.Body>
                                            <form className="space-y-6" onSubmit={() => {
                                                courseApi.delete(course.id)
                                                setModal(false)
                                            }}>
                                                <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                <h3 className="mb-5 text-lg text-center font-normal text-gray-500 dark:text-gray-400">
                                                    Bạn có chắc muốn xóa khóa học này?
                                                </h3>
                                                <div className="flex justify-center gap-4">
                                                    <Button color="failure" type='submit'>
                                                        Xóa
                                                    </Button>
                                                    <Button color="gray" onClick={() => {
                                                        setModal(false)
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
                                        src={`${course.cover_image}`}
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
                                                {/* <span className="ml-3 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border-[1px] border-green-500">Cơ bản</span> */}
                                            </h3>
                                        </Link>
                                        <button>



                                            <Dropdown label="" renderTrigger={() => <EllipsisVerticalIcon className="w-7 h-7" />} placement="left">
                                                <Dropdown.Item onClick={() => {

                                                }}>
                                                    <Link href={`/dashboard/course/edit/${course.id}`} >
                                                        Sửa khóa học
                                                    </Link>
                                                </Dropdown.Item>
                                                <Dropdown.Item><p className="text-red-600" onClick={() => setModal(true)}>Xóa khóa học</p></Dropdown.Item>
                                            </Dropdown>
                                        </button>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{course.averageRating.toFixed(1)}</span>
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
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
