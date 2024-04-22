"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import courseApi from '@/app/api/courseApi';
import Carousel from 'react-multi-carousel';
import { ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { formatCash } from "@/app/helper/FormatFunction";

export default function Home() {

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const [courses, setCourses] = useState([])

  useEffect(() => {
    async function fetchData() {
      await courseApi.getAll('').then((data: any) => {
        setCourses(data.data.courses)
      }
      ).catch((err: any) => { })
    }
    fetchData()
  }, [])
  return (
    <div className="mx-16">
      <section className="">
        <div className="flex relative h-[460px] mb-16">
          <Image
            src="/images/background.png"
            width={1920}
            height={933}
            alt="login"
            className='absolute top-0 left-0 z-0 overflow-hidden object-cover object-center'
          />
          <div className="w-1/2 px-4 mt-48 z-10">
            <h1 className="text-secondary font-bold text-[44px]">
              Joy of learning & teaching...
            </h1>
            <p className="mt-5 text-[20px] text-[#818894]">
              Rocket LMS is a fully-featured educational platform that helps instructors to create and publish video courses, live classes, and text courses and earn money, and helps students to learn in the easiest way.
            </p>
          </div>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Khóa học mới nhất</h2>
          </div>
          <Link href='#' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2">Xem tất cả</Link>
        </div>
        <div className="pt-4 pb-12 relative">
          <Carousel
            swipeable={false}
            draggable={true}
            showDots={true}
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            deviceType={"desktop"}
            dotListClass="bottom-10"
            itemClass="px-4 py-5"
            arrows={false}
            renderDotsOutside={true}
          >
            {courses.map((course: any) => {
              return (
                <div key={course.id} className='bg-white shadow-card_course rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300'>
                  <div className='relative w-full h-60'>
                    <Link href={`course/${course.id}`} className=''>
                      <Image
                        src={`${course.thumbnail}`}
                        fill
                        className='rounded-tl-2xl rounded-tr-2xl overflow-hidden object-cover object-center'
                        alt="logo"
                      />
                    </Link>
                  </div>
                  <div className='px-3 py-4'>
                    <div className='flex items-center'>
                      <div className='mr-2 w-10 h-10 max-h-10 max-w-10 rounded-full relative'>
                        <Image
                          src='/images/avatar-teacher.png'
                          fill
                          className='rounded-full overflow-hidden object-cover object-center'
                          alt="logo"
                        />
                      </div>
                      <div>
                        <Link href="" className='font-medium text-[#818894]'>Việt Lê</Link>
                      </div>
                    </div>
                    <h3 className="overflow-hidden text-[#17134] mt-4 h-8 font-bold">
                      {course.name}
                    </h3>


                    <div className="flex items-center mt-4">
                      <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                      <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                      <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                      <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                      <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                      <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">5.0</span>
                    </div>
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
                    <div className='mt-6'>
                      <span className='text-xl text-primary font-extrabold'>{formatCash(`${course.price}`)} VNĐ</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </Carousel>
        </div>
      </section>
    </div>

  )
}
