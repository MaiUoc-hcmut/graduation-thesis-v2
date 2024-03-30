"use client"

/* eslint-disable react/jsx-no-undef */
import Link from 'next/link';
import Image from 'next/image';
import { signout } from '@/redux/features/authSlice';
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation'
import { BellIcon } from "@heroicons/react/24/solid"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import courseApi from '@/app/api/courseApi';

export default function HeaderTeacher() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()
    const authReducer = JSON.parse(localStorage.getItem('persist:authReducer') || '{}')
    const isAuth = (authReducer?.isAuth == "true" || authReducer?.isAuthTeacher == "true") ? true : false
    const { user } = useAppSelector(state => state.authReducer);
    const [notifycations, setNotifycations] = useState<any>([])

    useEffect(() => {
        async function fetchCategory() {
            if (user) {
                const socket = io("http://localhost:4003", { transports: ["websocket"] });
                socket.emit("new_user_online", user.id);
                await courseApi.getNotify(`${user.id}`).then((data) => {
                    setNotifycations(data.data)
                })
                socket.on("created_topic", (data) => {
                    console.log(data);
                });
            }
        }
        fetchCategory()
    }, [user]);

    return (
        <header className="antialiased fixed top-0 left-0 w-full z-50 shadow- border-b-[1px] border-b-[#ececec] shadow-header_teacher">
            <nav className="bg-white border-gray-200 px-10 py-5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex justify-start items-center">
                        <Link href="/" className=''>
                            <Image
                                src="/images/logo.png"
                                width={170}
                                height={39}
                                alt="logo"
                            />
                        </Link>
                        <div className='flex justify-start flex-1 mx-10'>
                            <ul className='flex items-center text-[1rem] text-[#171347]'>
                                <li>
                                    <Link href="/" className='text-[#343434] px-[0.5rem] py-[1rem] hover:text-slate-500'>Trang chủ</Link>
                                </li>
                                <li>
                                    <Link href="/course" className='text-[#171347] px-[0.5rem] py-[1rem] hover:text-slate-500'>Khóa học</Link>
                                </li>
                                <li>
                                    <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem] hover:text-slate-500'>Giáo viên</Link>
                                </li>
                                {/* <li>
                                    <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem] hover:text-slate-500'>Cửa hàng</Link>
                                </li>
                                <li>
                                    <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem] hover:text-slate-500'>Diễn đàn</Link>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                    {
                        isAuth && user ?
                            <div className="flex items-center lg:order-2">

                                <div className='mr-3'>
                                    <button
                                        id="dropdownNotificationButton"
                                        data-dropdown-toggle="dropdownNotification"
                                        className="relative flex justify-center items-center text-sm font-medium text-center text-gray-500 hover:text-gray-600 focus:outline-none dark:hover:text-white dark:text-gray-400"
                                        type="button"
                                    >
                                        <BellIcon className='w-6 h-6' />
                                        <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0 start-3 dark:border-gray-900" />
                                    </button>
                                    {/* Dropdown menu */}
                                    <div
                                        id="dropdownNotification"
                                        className="z-20 hidden w-80 max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
                                        aria-labelledby="dropdownNotificationButton"
                                    >
                                        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
                                            Thông báo
                                        </div>
                                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {
                                                notifycations?.map((notify: any, index: any) => {
                                                    return (
                                                        <Link key={index}
                                                            href="#"
                                                            className="flex p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            <div className='flex'>
                                                                <div className="w-full flex">
                                                                    <div className='w-1/6 flex justify-center items-center mr-2'>
                                                                        <InformationCircleIcon className='w-8 h-8 text-slate-500' />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                                                                            Thông báo mới từ {" "}
                                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                                Hệ thống
                                                                            </span>
                                                                            {": "}
                                                                            {notify.content}

                                                                        </div>
                                                                        {/* Khóa học đã được tạo thành công */}
                                                                        <div className="text-xs text-blue-600 dark:text-blue-500">
                                                                            1 tháng trước
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )
                                                })
                                            }


                                        </div>
                                        <Link
                                            href="#"
                                            className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                                        >
                                            <div className="inline-flex items-center ">
                                                <svg
                                                    className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 14"
                                                >
                                                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                                </svg>
                                                Xem tất cả
                                            </div>
                                        </Link>
                                    </div>
                                </div>


                                {/* user */}
                                <div className='w-auto mr96 flex items-center justify-start' data-dropdown-toggle="dropdown">
                                    <button
                                        type="button"
                                        className="flex justify-center items-center"
                                        id="user-menu-button"
                                        aria-expanded="false"

                                    >
                                        <Image
                                            src={`${user.avatar ? user.avatar : '/images/avatar.png'}`}
                                            width={32}
                                            height={32}
                                            className='w-8 h-8 rounded-full'
                                            alt="logo"
                                        />
                                        <div className='ml-2 w-auto font-medium'>{user.name}</div>
                                    </button>
                                </div>
                                {/* Dropdown menu */}
                                <div
                                    className="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                    id="dropdown"
                                >
                                    <div className="py-3 px-4">
                                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                                            {user.name}
                                        </span>
                                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                            {user.email}
                                        </span>
                                    </div>
                                    <ul
                                        className="py-1 text-gray-500 dark:text-gray-400"
                                        aria-labelledby="dropdown"
                                    >
                                        <li>
                                            <Link
                                                href="/student/dashboard"
                                                className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                Quản lý tài khoản
                                            </Link>
                                        </li>
                                        {/* <li>
                                            <Link
                                                href="#"
                                                className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                            >
                                                Thông tin của tôi
                                            </Link>
                                        </li> */}
                                    </ul>

                                    <ul
                                        className="py-1 text-gray-500 dark:text-gray-400"
                                        aria-labelledby="dropdown"
                                    >
                                        <li>
                                            <button
                                                onClick={() => {
                                                    dispatch(signout())
                                                    router.push('/login')
                                                }}
                                                className="w-full text-left block py-2 px-4 text-sm text-[#f63c3c] hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            :
                            <div >
                                <ul className='flex text-[#343434]'>
                                    <li>
                                        <Link href={'/login'} className='mr-4 hover:text-slate-500'>Đăng nhập</Link>
                                    </li>
                                    <li>
                                        <Link href={'/register'} className='hover:text-slate-500'>Đăng ký</Link>
                                    </li>
                                </ul>
                            </div>
                    }


                </div>
            </nav>
        </header >
    )
}
