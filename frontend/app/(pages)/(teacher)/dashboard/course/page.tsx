"use client"

import Image from "next/image"
import Link from "next/link"
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from "react"
import courseApi from "@/app/api/courseApi"
import { useAppSelector } from "@/redux/store";


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
                                <div className="min-h-[200px]">
                                    <Image
                                        src={`${course.cover_image}`}
                                        width={300}
                                        height={200}
                                        alt="logo"
                                        className="rounded-l-[10px] h-full w-full``"
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
                                            {/* <PencilSquareIcon className="w-6 h-6 text-gray-500" onClick={() => courseApi.delete(course.id)} /> */}
                                            <Link href={`/dashboard/course/edit/${course.id}`} >
                                                <PencilSquareIcon className="w-6 h-6 text-gray-500" />
                                            </Link>
                                        </button>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                        <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">5.0</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-[20px] font-bold text-primary">{course.price}</span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between flex-wrap">
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Lớp:</span>
                                            <span className="text-sm text-[#171347]">{course.Categories[0].Class}</span>
                                        </div>
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Môn học:</span>
                                            <span className="text-sm text-[#171347]">{course.Categories[1].Subject}</span>
                                        </div>
                                        <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                            <span className="text-sm text-[#818894]">Mức độ:</span>
                                            <span className="text-sm text-[#171347]">{course.Categories[2].Level}</span>
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
