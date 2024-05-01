"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import courseApi from '@/app/api/courseApi';
import Carousel from 'react-multi-carousel';
import { ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { convertTime, formatCash } from "@/app/helper/FormatFunction";
import { renderOnlyStar, renderStars } from "@/app/helper/RenderFunction";
import CourseCard from "@/app/_components/Card/Course/CourseCard";

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
  const [coursesRating, setCoursesRating] = useState([])
  const [coursesResgistion, setCoursesRegistion] = useState([])

  useEffect(() => {
    async function fetchData() {
      await courseApi.getAll('').then((data: any) => {
        setCourses(data.data.courses)
      }
      ).catch((err: any) => { })
      await courseApi.getAll('sort=rating&order=desc').then((data: any) => {
        setCoursesRating(data.data.courses)
      }
      ).catch((err: any) => { })
      await courseApi.getAll('sort=resgistion&order=desc').then((data: any) => {
        setCoursesRegistion(data.data.courses)
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
              Tham gia học tập và & giảng dạy...
            </h1>
            <p className="mt-5 text-[20px] text-[#818894]">
              Study365 là một nền tảng giáo dục đầy đủ tính năng giúp giảng viên tạo và phát hành các khóa học video, lớp học trực tiếp và khóa học văn bản, kiếm tiền và giúp học sinh học tập theo cách dễ dàng nhất.
            </p>
          </div>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Khóa học mới nhất</h2>
          </div>
          <Link href='/course' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2">Xem tất cả</Link>
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
                <CourseCard course={course} key={course.id} />
              )
            })}
          </Carousel>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Khóa học phổ biến nhất</h2>
          </div>
          <Link href='/course?sort=registration&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2">Xem tất cả</Link>
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
            {coursesResgistion.map((course: any) => {
              return (
                <CourseCard course={course} key={course.id} />
              )
            })}
          </Carousel>
        </div>
      </section>
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Khóa học đánh giá tốt nhất</h2>
          </div>
          <Link href='/course?sort=rating&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2">Xem tất cả</Link>
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
            {coursesRating.map((course: any) => {
              return (
                <CourseCard course={course} key={course.id} />
              )
            })}
          </Carousel>
        </div>
      </section>
    </div>

  )
}
