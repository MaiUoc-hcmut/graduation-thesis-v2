"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, ChevronUpIcon, StarIcon } from '@heroicons/react/20/solid'
import courseApi from '@/app/api/courseApi';
import { useForm, SubmitHandler } from "react-hook-form"

type Review = {
    content: string
    rating: number
}


export default function CourseDetail({ params }: { params: { slug: string } }) {
    const [tab, setTab] = useState(1)
    const [toggle, setToggle] = useState<any>({})

    const [reviews, setReviews] = useState([]);
    const [changeData, setChangeData] = useState(false);
    const [course, setCourse] = useState({});
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    function formatTime(time: string): string {
        const res = new Date(time)
        return res.toLocaleString('vi-VN')
    }


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Review>()

    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => {
                setCourse(data.data)
            }
            )
            await courseApi.getReview(params.slug).then((data: any) => {
                setReviews(data.data)
            }
            )
        }
        fetchData()
    }, [changeData])
    reviews.sort(function (a, b) { return Date.parse(b.createdAt) - Date.parse(a.createdAt) })
    console.log(course, reviews);


    const handleHover = (hoverRating: any) => {
        setHoverRating(hoverRating);
    };

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

    return (
        <div className="">
            <div className="relative h-[530px] block overflow-hidden">
                <Image
                    src={`${course?.cover_image ? course?.cover_image : '/images/logo.png'}`}
                    fill={true}
                    className='w-full h-full absolute top-0 left-0 object-cover object-center'
                    alt="logo"
                />
                <div className='h-full w-full'>
                    <div className="relative z-0 after:content-['*'] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-black after:opacity-60 after:h-[530px]"></div>
                </div>
            </div>
            <div className='container relative top-[-200px] mx-auto px-20 w-full'>
                <div className='flex'>
                    <div className='px-4 w-2/3 flex flex-col'>
                        <div className=''>
                            <h1 className='font-black text-3xl text-white h-22 ovet text-ellipsis overflow-hidden'>
                                {course?.name}
                            </h1>
                            <div className="flex items-center mt-10">
                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-2 py-0.5 rounded">5.0</span>
                                <span className='text-white'>(1 Đánh giá)</span>
                            </div>
                            <div className='mt-4 text-white text-sm font-medium'>
                                <span className='mr-2'>Tạo bởi</span>
                                <Link href="#" className='underline decoration-1'>Việt Lê</Link>
                            </div>
                        </div>
                        <div className='mt-9'>
                            <div className="bg-secondary rounded-lg border-b border-gray-200 dark:border-gray-700">
                                <ul className="flex flex-wrap justify-between -mb-px text-sm font-semibold text-center text-gray-500 dark:text-gray-400">
                                    <li className="me-2">
                                        <button
                                            onClick={() => setTab(1)}
                                            className={`text-white inline-flex items-center justify-center p-4 ${tab == 1 ? 'border-b-2 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                                        >
                                            Thông tin chung
                                        </button>
                                    </li>
                                    <li className="me-2">
                                        <button
                                            onClick={() => setTab(2)}
                                            type='button'
                                            className={`text-white inline-flex items-center justify-center p-4 ${tab == 2 ? 'border-b-2 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                                            aria-current="page"
                                        >
                                            Nội dung khóa học (10)
                                        </button>
                                    </li>
                                    <li className="me-2">
                                        <button
                                            onClick={() => setTab(3)}
                                            className={`text-white inline-flex items-center justify-center p-4 ${tab == 3 ? 'border-b-2 border-primary rounded-t-lg active' : 'border-b-4 border-transparent rounded-t-lg hover:text-gray-300'} group`}
                                        >
                                            Đánh giá (1)
                                        </button>
                                    </li>

                                </ul>
                            </div>
                            <div className='pt-5'>
                                <div className={`${tab == 1 ? '' : 'hidden'}`}>
                                    <div className='rounded-md p-4 bg-[#f7fafd]'>
                                        <h3 className='text-secondary font-bold mb-4'>Bạn sẽ học được gì?</h3>
                                        <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                            <CheckIcon className='w-[18px] h-[18px] mr-2' />
                                            Kiến thức 1
                                        </p>
                                        <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                            <CheckIcon className='w-[18px] h-[18px] mr-2' />
                                            Kiến thức 2
                                        </p>
                                        <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                            <CheckIcon className='w-[18px] h-[18px] mr-2' />
                                            Kiến thức 3
                                        </p>
                                        <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                            <CheckIcon className='w-[18px] h-[18px] mr-2' />
                                            Kiến thức 4
                                        </p>
                                    </div>
                                    <div className='mt-5'>
                                        <h2 className="text-[#171347] font-bold flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">
                                            Thông tin về khóa học
                                        </h2>
                                        <div className='mt-5 text-[#818894]'>
                                            <p>
                                                Khóa học `New Update Features`` có thể là một chương trình đào tạo trực tuyến nhằm giới thiệu và hướng dẫn về các tính năng mới và cập nhật trong một lĩnh vực cụ thể, có thể là lĩnh vực công nghệ, phần mềm, hay một ngành nghề khác.
                                            </p>
                                        </div>
                                        <div className='mt-5'>
                                            <h3 className='font-bold text-secondary'>Yêu cầu</h3>
                                            <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                                <CheckIcon className='w-[18px] h-[18px] mr-2' />
                                                Yêu cầu 1
                                            </p>
                                            <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                                <CheckIcon className='w-[18px] h-[18px] mr-2' />
                                                Yêu cầu 2
                                            </p>
                                            <p className='flex items-start mt-2 text-[14px] text-[#818894]'>
                                                <CheckIcon className='w-[18px] h-[18px] mr-2' />
                                                Yêu cầu 3
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${tab == 2 ? '' : 'hidden'}`}>
                                    <ul>
                                        {course?.chapters?.map((chapter) => {
                                            return (
                                                <li key={chapter.id} className='bg-white py-3 pl-[20px] pr-6 rounded-lg mb-5 list-none border-[1px] border-[#ececec]'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex justify-center items-center">
                                                                <span className="flex justify-center items-center w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full mr-[10px]">
                                                                    <Squares2X2Icon className="w-6 h-6 text-white" />
                                                                </span>
                                                                <div>
                                                                    <span className="font-bold text-[rgb(23,19,71)] text-base">
                                                                        {chapter.name}
                                                                    </span>
                                                                    <span className="font-normal text-[818894] text-xs flex">
                                                                        {course?.chapters?.length} chủ đề
                                                                        | {chapter.totalDuration} giờ
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="ml-5 flex items-center justify-center">

                                                            <div className="mr-[10px]" >
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
                                                    </div>
                                                    <ul className={`${toggle[`open_chapter_${chapter.id}`] ? '' : 'hidden'} mt-4 pt-8 border-t-[1px] border-[#ececec]`}>
                                                        {
                                                            chapter.lectures?.map((lecture) => {
                                                                return (
                                                                    <li key={lecture.id} className='bg-white py-3 pl-[20px] pr-6 rounded-lg mb-5 list-none border-[1px] border-[#ececec]'>
                                                                        <div className='flex items-center justify-between'>
                                                                            <div className="flex justify-between items-center">
                                                                                <div className="flex justify-center items-center">
                                                                                    <span className='mr-3 bg-[#ececec] w-10 h-10 rounded-full flex justify-center items-center'>
                                                                                        <FilmIcon className='w-4 h-4' />
                                                                                    </span>
                                                                                    <span className="font-bold text-[rgb(23,19,71)] text-base">
                                                                                        {lecture.name}
                                                                                    </span>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </li>
                                            )

                                        })}
                                    </ul>

                                </div>
                                <div className={`${tab == 3 ? '' : 'hidden'}`}>
                                    <div className='flex items-center text-center'>
                                        <div className='w-1/4 px-4'>
                                            <div className='font-bold text-4xl text-primary text-center'>
                                                4.00
                                            </div>
                                            <div className="flex items-center justify-center mt-2">
                                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                                <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                                                <StarIcon className="w-5- h-5 text-gray-300 mr-[3px]" />
                                            </div>
                                            <div className='mt-4 text-[#343434]'>2 đánh giá</div>
                                        </div>
                                        <div className='flex-1'>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    5 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: "70%" }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    70%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    4 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: "17%" }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    17%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    3 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: "8%" }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    8%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    2 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: "4%" }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    4%
                                                </span>
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <div
                                                    className="text-sm font-medium text-primary"
                                                >
                                                    1 sao
                                                </div>
                                                <div className="w-3/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                                                    <div className="h-5 bg-yellow-300 rounded" style={{ width: "1%" }} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    1%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-10'>
                                        <div className="text-[#171347] font-bold flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">
                                            Đánh giá ({reviews.length})
                                        </div>
                                        <form onSubmit={handleSubmit(async (dataReview) => {
                                            console.log(dataReview);

                                            const formData = {
                                                data: {
                                                    ...dataReview,
                                                    "id_course": "3680824d-f68a-4ea7-9430-b9150006a04a",
                                                    rating
                                                }
                                            }
                                            await courseApi.createReview(formData)
                                            reset()
                                            setRating(0)
                                            setChangeData(!changeData)

                                        })} className="flex flex-col items-start mt-5">
                                            <div className=''>
                                                <div className='flex items-center mb-4'>
                                                    <div className=''>
                                                        <Image
                                                            src="/images/avatar.png"
                                                            width={40}
                                                            height={40}
                                                            className='w-10 h-10 rounded-full'
                                                            alt="logo"
                                                        />
                                                    </div>
                                                    <div className='flex flex-col ml-2'>
                                                        <span className='font-medium text-secondary'>
                                                            Việt Lê
                                                        </span>
                                                        <div className="flex items-center">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <StarIcon
                                                                    key={star}
                                                                    className={`h-5 w-5 cursor-pointer ${(hoverRating || rating) >= star ? 'text-yellow-300' : 'text-gray-300'
                                                                        }`}
                                                                    onMouseEnter={() => handleHover(star)}
                                                                    onMouseLeave={() => handleHover(0)}
                                                                    onClick={() => setRating(star)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <textarea
                                                placeholder="Nhập đánh giá của bạn..."
                                                {...register("content", { required: true })}
                                                className="w-full p-2 border rounded focus:ring-0 focus:border-primary_border"
                                                rows={4}
                                            ></textarea>
                                            <button
                                                type="submit"

                                                className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary_hover"
                                            >
                                                Đánh giá
                                            </button>
                                        </form>
                                        <div className='mt-12'>
                                            {
                                                reviews.map((review) => (
                                                    <div key={review.id} className="bg-white px-4 py-4 mb-5 border rounded-lg shadow-md">
                                                        <div className='flex items-center justify-between'>
                                                            <div className='flex items-center mt-2'>
                                                                <div>
                                                                    <Image
                                                                        src="/images/avatar.png"
                                                                        width={40}
                                                                        height={40}
                                                                        className='w-10 h-10 rounded-full'
                                                                        alt="logo"
                                                                    />
                                                                </div>
                                                                <div className='flex flex-col ml-2'>
                                                                    <span className='font-medium text-secondary'>
                                                                        Việt Lê
                                                                    </span>
                                                                    <div className="flex justify-center items-center">{renderStars(review.rating)}</div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className='text-[#818894] text-sm'>
                                                                    {formatTime(review.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='text-[#818894] mt-4 font-normal'>
                                                            {review.content}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 mx-4'>
                        <div className='rounded-2xl shadow-card_course pb-8'>
                            <div className='h-[200px] relative'>
                                <Image
                                    src={`${course?.thumbnail ? course?.thumbnail : '/images/logo.png'}`}
                                    fill={true}
                                    className='w-full h-full overflow-hidden object-center object-cover rounded-tl-2xl rounded-tr-2xl'
                                    alt="logo"
                                />
                            </div>
                            <div className='px-5'>
                                <div className='flex items-center justify-center mt-5'>
                                    <span className='text-3xl text-primary font-bold'>{course?.price}0.000 VNĐ</span>
                                </div>
                                <div className='mt-5 flex flex-col'>
                                    <Link href="" className='px-8 font-medium rounded-lg flex items-center justify-center bg-primary text-white h-12'>Mua khóa học</Link>
                                </div>
                                <div className='mt-9'>
                                    <strong className='text-[#343434]'>Khóa học này bao gồm</strong>
                                    <div className='mt-4 grid grid-cols-2 gap-2'>
                                        <div className='flex items-center'>
                                            <ClockIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>1:20 giờ</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <Squares2X2Icon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>20 chương</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <FilmIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>120 bài giảng</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <DocumentTextIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                            <span className='text-[#171347] font-medium text-sm'>120 đề thi</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

