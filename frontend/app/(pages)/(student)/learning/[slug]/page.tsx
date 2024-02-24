"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon } from '@heroicons/react/24/solid'
import { ChevronDownIcon, ChevronUpIcon, Squares2X2Icon, FilmIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import courseApi from "@/app/api/courseApi"
import { ReactQuillEditorComment } from '@/app/_components/Editor/ReactQuillEditorComment'
import parse from 'html-react-parser';

export default function LearningPage({ params }: { params: { slug: string } }) {
    const [course, setCourse] = useState()
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const [tab, setTab] = useState(0)
    const [link, setLink] = useState(0)
    const [content, setContent] = useState('')
    const [lectureId, setLectureId] = useState('')
    const [comments, setComments] = useState([])


    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => {
                setCourse(data.data)
                setLink(data.data.chapters[0]?.lectures[0]?.video)
                setLectureId(data.data.chapters[0]?.lectures[0]?.id)
            }
            )
            await courseApi.getCommentByLecture(lectureId).then((data: any) => {
                setComments(data.data)
            }
            )
        }
        fetchData()
    }, []);

    console.log(course, lectureId, comments);

    function formatTime(time: string): string {
        const objectDate = new Date(time)
        // const objectDate = res.toLocaleString('vi-VN')
        let day = objectDate.getDate();

        let month = objectDate.getMonth() + 1;

        let year = objectDate.getFullYear();

        return day + "/" + month + "/" + year
    }

    function time_convert(time: number) {
        const totalMinutes = Math.floor(time / 60);

        const seconds = time % 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const strHours = hours < 10 ? `0${hours}` : `${hours}`
        const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
        const strSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`


        return `${strHours}:${strMinutes}:${strSeconds}`;
    }


    return (
        <div className="">
            <div className="fixed top-0 left-0 h-24 w-full flex z-10 bg-white items-center justify-between px-9 py-4 shadow-sm">
                <div className="flex items-center">
                    <div>
                        <Link href="/" className=''>
                            <Image
                                src="/images/logo.png"
                                width={170}
                                height={39}
                                alt="logo"
                            />
                        </Link>
                    </div>
                    <div className='flex flex-col border-l-[1px] border-[#f1f1f1] ml-3 pl-3'>
                        <div>
                            <span className='font-bold text-[#343434] text-lg'>{course?.name}</span>
                        </div>
                        <div className='flex items-center'>
                            <div className='w-[465px]'>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-yellow-300 h-2.5 rounded-full" style={{ width: "45%" }} />
                                </div>
                            </div>
                            <span className='ml-3 font-medium text-[#818894]'>Hoàn thành 45%</span>
                        </div>
                    </div>
                </div>
                <div className='flex items-center mt-[5px]'>
                    <div className='flex items-center'>
                        {/* <Link href="#" className='bg-white mr-2 text-[#343434] cursor-pointer px-4 py-1 border rounded border-[1px] border-[#e3e1e1]'>
                            Bình luận
                        </Link> */}
                        <Link href={`/course/${params.slug}`} className='bg-white mr-5 text-[#343434] cursor-pointer px-4 py-1 border rounded border-[1px] border-[#e3e1e1]'>
                            Trang khóa học
                        </Link>
                        {/* <button type="button">
                            <Bars3Icon className='w-6 h-6' />
                        </button> */}
                    </div>
                </div>
            </div>
            <div className='flex relative h-[calc(100vh-85px)] w-[calc(100%-373px)]  mt-24'>
                <div className='flex-1'>
                    <div className='flex bg-black p-4 h-full'>
                        <div className='w-full rounded-xl'>
                            <div className='flex flex-col h-full'>
                                <ReactPlayer width='100%' height='100%' controls={true} url={link ? link : '/'} />
                            </div>
                        </div>
                    </div>
                    <div className=' overflow-auto'>
                        <div className='px-10 mt-5'>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                                <li className="me-2">
                                    <button
                                        type='button'
                                        onClick={() => setTab(0)}
                                        className={`${tab === 0 ? 'text-blue-600 bg-gray-100 active' : 'hover:text-gray-600 hover:bg-gray-50'} inline-block p-4 px-8 rounded-t-lg `}
                                    >
                                        Bình luận
                                    </button>
                                </li>
                                <li className="me-2">
                                    <button
                                        type='button'
                                        onClick={() => setTab(1)}
                                        className={`${tab === 1 ? 'text-blue-600 bg-gray-100 active' : 'hover:text-gray-600 hover:bg-gray-50'} inline-block p-4 px-8 rounded-t-lg `}
                                    >
                                        Tài liệu
                                    </button>
                                </li>
                            </ul>

                        </div>
                        <div>
                            <div className={`${tab === 0 ? '' : 'hidden'} p-10`}>
                                <p className='font-medium text-xl mb-5'>Bình luận của học sinh</p>
                                <div>
                                    <div className='flex'>
                                        <div className='mr-4'>
                                            <Image
                                                width={45}
                                                height={45}
                                                src="/images/avatar.png"
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className='flex-1 mr-4'>
                                            <form onSubmit={async (e: any) => {
                                                e.preventDefault()
                                                const formData = {
                                                    data: {
                                                        id_lecture: lectureId,
                                                        content: content,
                                                    }
                                                }
                                                await courseApi.createComment(formData)
                                                // setChangeData(!changeData)
                                            }}>
                                                <div className={`${toggle[`edit-cmt`] ? 'hidden' : ''}`}>
                                                    <input onFocus={() => {
                                                        setToggle({ ...toggle, [`edit-cmt`]: !toggle[`edit-cmt`] })
                                                    }} type="text" className="bg-gray-50 border-b border-b-[#ccc] mb-2 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="Bạn có thắc mắc gì trong bài học này?" />
                                                </div>
                                                <div className={`${toggle[`edit-cmt`] ? '' : 'hidden'}`}>
                                                    <ReactQuillEditorComment value={content} setValue={setContent} />
                                                </div>
                                                <div className='flex justify-end mt-4'>
                                                    <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => (setToggle({ ...toggle, [`edit-cmt`]: !toggle[`edit-cmt`] }))}>Hủy</button>
                                                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Bình luận</button>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                                <div className='mt-10  '>
                                    <p className='font-medium text-lg mb-10'>{comments.length} bình luận</p>

                                    {
                                        comments.map((cmt) => {
                                            return (
                                                <div key={cmt.id} className='' >
                                                    <div className='flex mb-2'>
                                                        <div className=''>
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src="/images/avatar.png"
                                                                alt="avatar"
                                                                className='rounded-full'
                                                            />
                                                        </div>
                                                        <div className=' mx-5'>

                                                            <div className='bg-[#f2f3f5] rounded-xl'>
                                                                <div className='p-3'>
                                                                    <div className='flex items-center'>
                                                                        <p className='mr-2 text-[#184983] font-medium'>Mai Nguyện Ước:</p>
                                                                        <p className='text-[#828282] text-sm'>{formatTime(cmt.createdAt)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <div className='mt-2 max-w-3xl min-w-75'>{parse(cmt.content)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='mt-2'>
                                                                <button type='button' className='text-blue-600 hover:text-blue-800' onClick={() => {
                                                                    setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: !toggle[`edit-cmt${cmt.id}`] })
                                                                }}>Trả lời</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`ml-30 w-4/5 ${toggle[`edit-cmt${cmt.id}`] ? '' : 'hidden'}`}>
                                                        <form className=''>
                                                            <div className='mt-3'>

                                                            </div>
                                                            <div className='flex justify-end mt-4'>
                                                                <button type="button" className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => (setToggle({ ...toggle, [`edit-cmt${cmt.id}`]: !toggle[`edit-cmt${cmt.id}`] }))}>Hủy</button>
                                                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Bình luân</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                            </div>
                            <div className={`${tab === 1 ? '' : 'hidden'} p-10`}>Tài liệu</div>
                        </div>
                    </div>
                </div>
                <div className='w-[373px] min-w-[373px] mt-24 h-full fixed right-0 top-0 border-l-[1px] shadow-sm border-[#f1f1f1]'>
                    <div className='text-left text-lg font-bold mx-4 py-2 mt-2 border-b-[1px] border-[#f1f1f1]'>
                        Nội dung
                    </div>
                    <div className='overflow-auto h-[400px] sidebar_learning'>
                        <div className=''>
                            <div className='p-4'>

                                {
                                    course?.chapters?.map((chapter) => {
                                        return (
                                            <div key={chapter.id} className='mb-3'>

                                                <div className='border-[1px] border-[#f1f1f1] px-2 py-2 rounded-lg'>
                                                    <div className={`flex justify-between items-center ${toggle[`open_chapter_${chapter.id}`] ? 'pb-3' : ''}`}>
                                                        <div className="flex justify-center items-center">
                                                            <span className="flex justify-center items-center w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full mr-[10px]">
                                                                <Squares2X2Icon className="w-6 h-6 text-white" />
                                                            </span>
                                                            <div>
                                                                <span className="font-bold text-[rgb(23,19,71)] text-lg">
                                                                    {chapter.name}
                                                                </span>
                                                                <span className="font-normal text-[818894] text-xs flex">
                                                                    {chapter.lectures?.length} chủ đề
                                                                    | {time_convert(chapter.totalDuration)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-5 flex items-center justify-center">
                                                            {
                                                                !toggle[`open_chapter_${chapter.id}`] ?
                                                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                                        setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: true })
                                                                    }}>
                                                                        <ChevronDownIcon className="w-5 h-5" />
                                                                    </button>
                                                                    :
                                                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                                        setToggle({ ...toggle, [`open_chapter_${chapter.id}`]: false })
                                                                    }}>
                                                                        <ChevronUpIcon className="w-5 h-5" />
                                                                    </button>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className={`${toggle[`open_chapter_${chapter.id}`] ? '' : 'hidden'} border-t-[1px] border-[#f1f1f1] pt-4`}>
                                                        <div>
                                                            {
                                                                chapter.lectures.map((lecture) => {
                                                                    return (
                                                                        <div onClick={() => {
                                                                            setLink(lecture.video)
                                                                            setLectureId(lecture.id)
                                                                        }} key={lecture.id} className={`${lectureId == lecture.id ? 'bg-[#f1f1f1]' : 'bg-white'} px-2 py-1 cursor-pointer flex items-center`}>
                                                                            <span className='mr-3 bg-[#ececec] w-10 h-10 rounded-full flex justify-center items-center'>
                                                                                <FilmIcon className='w-4 h-4' />
                                                                            </span>
                                                                            <div className='flex flex-col'>
                                                                                <span className='font-medium text-[#171347]'>{lecture.name}</span>
                                                                                <span className='text-[#818894] text-xs'>{time_convert(lecture.duration)}</span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}
