'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/redux/store';
import header from '@/styles/header.module.css';
import Avatar from '@/components/home/avatar';
import { useEffect } from 'react';

export default function Header() {
    const { isAuth } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        
    }, [isAuth]);
    return (
        <div>
            <nav>
                <div className='h-20 flex items-center justify-between px-10'>
                    <div className='flex-col justify-center justify-items-center w-20'>
                        <Image
                            id={header['logo']}
                            width={120}
                            height={120}
                            src="/logo-study365.png"
                            alt="logo google"
                            style={{
                                maxWidth: '200'
                            }}
                        />
                    </div>

                    <div className='flex-1'>
                        <form className='w-1/2 ml-20'>
                            <div className="flex">
                                <div className="relative w-full ">
                                    <input type="search" id={header["search-input"]} className="block p-2.5 w-full z-20 text-sm text-gray-900" placeholder="Tìm kiếm giáo viên, khóa học, đề thi, tài liệu " required />
                                    <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-btn_primary rounded-lg">
                                        <svg className="w-4 h-4 text-[white]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {
                        isAuth && <Avatar />
                    }
                    {
                        !isAuth && (
                            <div className='flex w-56 h-1/2'>
                                <Link href="/login" className='w-full mr-2'>
                                    <button
                                        className="flex w-full justify-center items-center rounded-md bg-btn_primary px-3 py-1.5 text-sm font-semibold leading-6 border-b-2 border-b-[#196aac] shadow-sm"
                                        style={{
                                            color: 'white'
                                        }}
                                    >
                                        Đăng nhập
                                    </button>
                                </Link>
                                <Link href="/signup" className='w-full'>
                                    <button
                                        className="flex w-full justify-center items-center rounded-md bg-slate-200 px-3 py-1.5 text-sm font-semibold leading-6 text-black border-b-2 border-b-slate-400 shadow-sm"
                                    >
                                        Đăng ký
                                    </button>
                                </Link>
                            </div>
                        )
                    }
                </div>
                <div className='text-[white] bg-primary'>
                    <ul className='flex ml-10'>
                        <li className='py-2 px-4'>
                            <Link href="/">Trang chủ</Link>
                        </li>
                        <li className='py-2 px-4'>
                            <Link href="/">Khóa học</Link>
                        </li>
                        <li className='py-2 px-4'>
                            <Link href="/">Giáo viên</Link>
                        </li>
                        <li className='py-2 px-4'>
                            <Link href="/">Đề thi</Link>
                        </li>
                        <li className='py-2 px-4'>
                            <Link href="/">Tài liệu</Link>
                        </li>
                        <li className='py-2 px-4'>
                            <Link href="/">Liên hệ</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}     
