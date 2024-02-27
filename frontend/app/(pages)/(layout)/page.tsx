"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import courseApi from '@/app/api/courseApi';


export default function Home() {
  const [courses, setCourses] = useState([])
  useEffect(() => {
    async function fetchData() {
      await courseApi.getAll().then((data: any) => {
        setCourses(data.data)
      }
      )
    }
    fetchData()
  }, [])
  return (
    <div className="mx-16">
      <div className="mt-12">
        <div id="default-carousel" className="relative w-full" data-carousel="slide">
          {/* Carousel wrapper */}
          <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
            {/* Item 1 */}
            <div className="hidden duration-700 ease-in-out" data-carousel-item="">
              <div className='grid grid-cols-2 gap-x-8 gap-y-8 mt-2'>
                {
                  courses.map((course) => {
                    return (
                      <div key={course.id} className='bg-white shadow-card_course rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105  duration-300'>
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
                  })
                }
              </div>
            </div>
            {/* Item 2 */}
            <div className="hidden duration-700 ease-in-out" data-carousel-item="">
            </div>
          </div>
          {/* Slider indicators */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              className="w-3 h-3 rounded-full"
              aria-current="true"
              aria-label="Slide 1"
              data-carousel-slide-to={0}
            />
            <button
              type="button"
              className="w-3 h-3 rounded-full"
              aria-current="false"
              aria-label="Slide 2"
              data-carousel-slide-to={1}
            />
          </div>
          {/* Slider controls */}
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev=""
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next=""
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>

    </div>

  )
}
