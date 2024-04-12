"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from "@/redux/store";
import { usePathname } from 'next/navigation'
export default function SidebarStudent() {
    const { user } = useAppSelector(state => state.authReducer);
    const pathname = usePathname()
    console.log(pathname);

    return (
        <div className=''>
            <aside
                id="sidebar-multi-level-sidebar"
                className="fixed top-[55px] left-0 bottom-0 w-[254px] h-full shadow-sidebar_teacher pt-[20px] pb-[25px] px-[5px]  transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className='flex flex-row items-end justify-center'>
                        <Link href="#">
                            <Image
                                src={`${user.avatar ? user.avatar : '/images/avatar.png'} `}
                                width={100}
                                height={100}
                                alt="avatar"
                                className='rounded-full'
                            />
                        </Link>
                    </div>
                    <div className='flex flex-row items-end justify-center mt-4 font-semibold'>
                        <Link href="#">
                            <h3 className='text-[1.25rem]'>
                                {user.name}
                            </h3>
                        </Link>
                    </div>
                    <div className='relative mt-6 overflow-y-scroll mb-6 h-[calc(100%-200px)] sidebar'>
                        <ul className="space-y-2 font-medium absolute top-0 left-0 w-full h-[1000px] pr-1">
                            <li>
                                <Link
                                    href="/student/dashboard"
                                    className={`${pathname == '/student/dashboard' ? 'bg-slate-100' : ''} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                                >

                                    <span className="ms-3">Tổng quan</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    aria-controls="dropdown-example"
                                    data-collapse-toggle="dropdown-example"
                                >

                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        Quản lý khóa học
                                    </span>
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>
                                <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                    <li>
                                        <Link
                                            href="/student/dashboard/course"
                                            className={`${pathname == '/student/dashboard/course' ? 'bg-slate-100' : ''} flex ml-4 items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-4 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Khóa học của tôi
                                            </div>

                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    aria-controls="exam"
                                    data-collapse-toggle="exam"
                                >
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                        Quản lý đề thi
                                    </span>
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 10 6"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="m1 1 4 4 4-4"
                                        />
                                    </svg>
                                </button>
                                <ul id="exam" className="hidden py-2 space-y-2">
                                    <li>
                                        <Link
                                            href="/student/dashboard/exam"
                                            className={`${pathname == '/student/dashboard/exam' ? 'bg-slate-100' : ''} ml-4 flex items-center p-2 text-gray-900 transition duration-75 rounded-lg pl-2 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
                                        >
                                            <div className='ml-2'>
                                                Đề thi của tôi
                                            </div>

                                        </Link>
                                    </li>
                                </ul>
                            </li>

                        </ul>
                    </div>
                </div>
            </aside >

        </div >
    )
}
