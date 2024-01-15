"use client"
import Link from 'next/link';
import Image from 'next/image';

export default function HeaderTeacher() {
    return (
        <div className=''>
            <nav className='conatainer px-10 py-3 fixed top-0 w-full bg-white z-50 shadow- border-b-[1px] border-b-[#ececec] shadow-header_teacher'>
                <div className='flex items-center justify-between'>
                    <div>
                        <Link href="#" className=''>
                            <Image
                                src="/images/logo.png"
                                width={170}
                                height={39}
                                alt="logo"
                            />
                        </Link>
                    </div>

                    <div className='flex justify-start flex-1 mx-10'>
                        <ul className='flex items-center text-[1rem] text-[#171347]'>
                            <li>
                                <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem]'>Trang chủ</Link>
                            </li>
                            <li>
                                <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem]'>Khóa học</Link>
                            </li>
                            <li>
                                <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem]'>Giáo viên</Link>
                            </li>
                            <li>
                                <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem]'>Cửa hàng</Link>
                            </li>
                            <li>
                                <Link href="#" className='text-[#171347] px-[0.5rem] py-[1rem]'>Diễn đàn</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div>
                            tin nhan
                        </div>

                        <div>
                            Thong bao
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
