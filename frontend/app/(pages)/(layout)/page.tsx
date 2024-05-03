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
import userApi from "@/app/api/userApi";

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

  const responsiveTeacher = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [coursesRating, setCoursesRating] = useState([])
  const [coursesResgistion, setCoursesRegistion] = useState([])

  useEffect(() => {
    async function fetchData() {
      await courseApi.getAll('', '1').then((data: any) => {
        setCourses(data.data.courses)
      }
      ).catch((err: any) => { })
      await courseApi.getAll('sort=rating&order=desc', '1').then((data: any) => {
        setCoursesRating(data.data.courses)
      }
      ).catch((err: any) => { })
      await courseApi.getAll('sort=resgistion&order=desc', '1').then((data: any) => {
        setCoursesRegistion(data.data.courses)
      }
      ).catch((err: any) => { })
      await userApi.getAllTeacher('sort=rating&order=desc', '1').then((data: any) => {
        setTeachers(data.data.teachers)
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
          <Link href='/course' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
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
          <Link href='/course?sort=registration&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
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
          <Link href='/course?sort=rating&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
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
      {/* <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Đề thi đánh giá tốt nhất</h2>
          </div>
          <Link href='/course?sort=rating&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
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
      </section> */}
      <section className="pt-12">
        <div className="flex justify-between">
          <div>
            <h2 className="text-[24px] text-secondary font-bold">Danh sách giáo viên</h2>
          </div>
          <Link href='/course?sort=rating&order=desc' className="border-[1px] border-[#f1f1f1] text-[#818894] rounded-md px-4 py-2 hover:bg-slate-300">Xem tất cả</Link>
        </div>
        <div className="pt-4 pb-12 relative">
          <Carousel
            swipeable={false}
            draggable={true}
            showDots={true}
            responsive={responsiveTeacher}
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

            {teachers.map((teacher: any) => {
              return (
                <div key={teacher.id} className="bg-white p-5 rounded-lg text-center" style={{
                  boxShadow: "0 19px 38px rgba(0, 0, 0, 0.05), 0 15px 12px rgba(0, 0, 0, 0.02)"
                }}>
                  <div className="flex justify-center items-center">
                    <Image
                      src={`${teacher?.avatar ? teacher.avatar : '/images/avatar-teacher.png'} `}
                      width={100}
                      height={100}
                      alt="avatar"
                      className="rounded-full"
                    />
                  </div>
                  <div className="mt-3 flex flex-col justify-center items-center">
                    <div className="text-[#343434] font-bold text-lg">
                      {teacher?.name}
                    </div>
                    <div className="text-[#818894]">
                      {
                        teacher.Categories[0]?.Subject
                      }
                    </div>
                    <div className="mt-2">
                      {renderOnlyStar(Math.floor(teacher?.average_rating))}
                    </div>
                    <Link href={`/teacher/profile/${teacher.id}`} className="mt-4">
                      <button type='submit' className='px-3 py-1 bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Xem hồ sơ</button>
                    </Link>
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
