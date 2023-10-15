import introStyle from '@/styles/home/intro.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Intro () {
    return (
        <div className="flex bg-blue-800 h-100">
            <div className="flex-grow h-100 mt-12 mb-12 ml-12">
                <div className='mb-6'>
                    <div style={{color: '#F6D75B', fontWeight: 'bold'}}>
                        <p>DÀNH CHO HỌC SINH TRUNG HỌC PHỔ THÔNG,</p>
                        <p>GIÁO DỤC THƯỜNG XUYÊN, THÍ SINH ÔN THI THPT QUỐC GIA - ĐẠI HỌC</p>
                    </div>
                </div>
                <div className='mt-6 mb-6 text-4xl font-bold text-white'>
                    <p>Chủ động tự học mọi lúc mọi nơi với</p>
                    <p>website học trực tuyến</p>
                    <Link href='/'><p style={{color: '#01CD9C'}}>Study365.edu</p></Link>
                </div>
                <div className='mt-6 mb-6 text-white'>
                    <p>Lớp 10 - Lớp 11 - Lớp 12</p>
                    <p>Toán học - Vật lý - Hóa học - Sinh học - Tiếng Anh - Ngữ văn - Lịch sử - Địa lý</p>
                </div>
                <div className='mt-6'>
                    <p style={{color: '#F6D75B'}}>
                        Các kiến thức được hệ thống một cách logic, bám sát chương trình học,
                        củng cố và nâng cao kiến thức cho học sinh.
                    </p>
                </div>
            </div>

            <div className='mr-15' style={{width: 500}}>
                <Image
                    src='/intro.png'
                    alt="introduction image"
                    width={350}
                    height={350}
                />
            </div>
        </div>
    )
}