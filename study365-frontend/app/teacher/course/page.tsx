/* eslint-disable react/jsx-key */
'use client'
import courseApi from "@/app/api/courseApi"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"


export default function OverviewCourse() {
    const [courseList, setCourseList] = useState([])

    useEffect(() => {
        const fetchCourseList = async () => {
            try {
                const response = await courseApi.getAll({});
                setCourseList(response);
            } catch (error) {
                console.log('Failed to fetch course list: ', error);
            }
        }
        fetchCourseList();
    }, []);

    const listCourse = courseList.map((course: any) => {
        return (
            <div key={course.id} className="w-full flex flex-row p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="mr-5">
                    <Image
                        src="/teacher.png"
                        width={120}
                        height={120}
                        alt="logo facebook"
                        style={{ width: '100%', height: '100%', maxWidth: '140px' }}
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <a href="#">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.name}</h5>
                    </a>

                    <div className="mb-2 mt-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Lớp 12</span>
                        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Toán</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Cơ bản</span>
                    </div>
                    <div className="mb-5">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">Công khai</span>
                    </div>
                    <Link href={`course/${course.id}`} className="mt-2 w-32 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Xem khóa học
                    </Link>
                </div>
            </div>

        )
    })


    return (
        <div>
            <div className="py-5 pr-5 flex flex-row justify-between items-center">
                <h3 className="font-medium text-2xl py-2 px-5">Quản lý khóa học</h3>
                <Link href='course/create'>
                    <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Tạo khóa học</button>
                </Link>
            </div>
            <div className="flex flex-row justify-between items-center mt-4 pr-5">
                <form className="flex items-center flex-1">
                    <select id="countries" className="bg-gray-50 mx-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Chọn lớp</option>
                        <option value="toán">Toán</option>
                    </select>
                    <select id="countries" className="bg-gray-50 mx-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Chọn môn học</option>
                        <option value="toán">Toán</option>
                    </select>
                    <select id="countries" className="bg-gray-50 mx-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Chọn mức độ</option>
                        <option value="toán">Toán</option>
                    </select>

                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="w-full">
                        <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm khóa học..." />
                    </div>
                    <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </form>


            </div>


            <div className="grid grid-cols-2 gap-6 p-5 mt-10">
                {listCourse}
            </div>
        </div>
    )
}
