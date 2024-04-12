"use client"

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon, ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import Image from 'next/image';
import categoryApi from '@/app/api/category'
import userApi from '@/app/api/userApi'
import { useSearchParams } from 'next/navigation'


const sortOptions = [
    { name: 'Phổ biến nhất', href: '#', current: true },
    { name: 'Đánh giá tốt nhất', href: '#', current: false },
    { name: 'Mới nhất', href: '#', current: false },
    { name: 'Giá: Thấp đến cao', href: '#', current: false },
    { name: 'Giá: Cao đến thấp', href: '#', current: false },
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function TeacherPage() {
    const [teachers, setTeachers] = useState<any>()
    const [category, setCategory] = useState<any>()
    const searchParams = useSearchParams()
    const subjectFilters = searchParams.getAll('subject')
    const levelFilters = searchParams.getAll('level')
    const classFilters = searchParams.getAll('class')

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

    useEffect(() => {
        async function fetchData() {
            let filterString = ''
            subjectFilters.map((s) => { filterString += `subject=${s}` })
            levelFilters.map((l) => { filterString += `&level=${l}` })
            classFilters.map((c) => { filterString += `&class=${c}` })

            // if (subjectFilters.length != 0 || levelFilters.length != 0 || classFilters.length != 0) {
            //     await userApi.filter(filterString).then((data: any) => {
            //         setExams(data.data.courses)
            //     }
            //     )
            // }
            // else {
            //     await userApi.getAll().then((data: any) => {
            //         setExams(data.data)
            //     }
            //     )
            // }
            await userApi.getAllTeacher().then((data: any) => {
                setTeachers(data.data)
            }
            )
            await categoryApi.getAll().then((data: any) => {
                setCategory([
                    {
                        id: "subject",
                        name: "Môn học",
                        options: data.Subject.map((subject: any) => {
                            return { ...subject, checked: subjectFilters.includes(subject.id) }
                        })
                    },
                    {
                        id: "level",
                        name: "Mức độ",
                        options: data.Level.map((level: any) => {
                            return { ...level, checked: levelFilters.includes(level.id) }
                        })
                    },
                    {
                        id: "class",
                        name: "Lớp",
                        options: data.Class.map((grade: any) => {
                            return { ...grade, checked: classFilters.includes(grade.id) }
                        })
                    },

                ])
            })
        }
        fetchData()
    }, [])

    console.log(teachers);
    return (
        <div className="bg-white container mx-auto">
            <div>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Đề thi</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sắp xếp
                                        <ChevronDownIcon
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {sortOptions.map((option) => (
                                                <Menu.Item key={option.name}>
                                                    {({ active }) => (
                                                        <Link
                                                            href={option.href}
                                                            className={classNames(
                                                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >

                                                            {option.name}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            <button
                                type="button"
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="flex w-full">
                            <form className="hidden lg:block w-1/4 mr-10">
                                <h3 className="sr-only">Categories</h3>

                                {category?.map((section: any) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6" defaultOpen>
                                        {({ open }) => (
                                            <>

                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className={`pt-6`}>
                                                    <div className="space-y-4">
                                                        {section.options.map((option: any, optionIdx: any) => (
                                                            <div key={option.id} className="flex items-center">
                                                                <input
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}`}
                                                                    defaultValue={option.id}
                                                                    type="checkbox"
                                                                    defaultChecked={option.checked}
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 text-sm text-gray-600"
                                                                >
                                                                    {option.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                                <button className='px-5 h-11 w-full mt-5 bg-primary font-medium rounded-md border-primary text-white'>Lọc</button>
                            </form>

                            <div className="lg:col-span-3 flex-1">
                                {/* <div className='grid grid-cols-2 gap-x-8 gap-y-8 mt-2'>
                                    {
                                        teachers?.map((exam: any) => {
                                            return (
                                                <Link key={exam.id} href={`exam/${exam.id}`} className=''>
                                                    <div className='bg-white shadow-card_course rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105  duration-300'>
                                                        <div className='relative w-full h-60'>
                                                            <Image
                                                                src={`${exam.thumbnail}`}
                                                                fill
                                                                className='rounded-tl-2xl rounded-tr-2xl overflow-hidden object-cover object-center'
                                                                alt="logo"
                                                            />
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
                                                                    <p className='font-medium text-[#818894]'>Việt Lê</p>
                                                                </div>
                                                            </div>
                                                            <h3 className="overflow-hidden text-[#17134] mt-4 h-8 font-bold">
                                                                {exam.name}
                                                            </h3>


                                                            <div className="flex items-center mt-4">
                                                                {renderStars(Math.floor(exam?.average_rating))}
                                                                <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">{exam?.average_rating.toFixed(1)}</span>
                                                            </div>
                                                            <div className='mt-4 grid grid-cols-2 gap-2'>
                                                                <div className='flex items-center'>
                                                                    <ClockIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                    <span className='text-[#171347] font-medium text-sm'>{convertTime(exam?.total_duration)} giờ</span>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <Squares2X2Icon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                    <span className='text-[#171347] font-medium text-sm'>{exam?.total_chapter} chương</span>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <FilmIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                    <span className='text-[#171347] font-medium text-sm'>{exam?.total_lecture} bài giảng</span>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <DocumentTextIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                    <span className='text-[#171347] font-medium text-sm'>{exam?.total_exam} đề thi</span>
                                                                </div>

                                                            </div>
                                                            <div className='mt-6'>
                                                                <span className='text-xl text-primary font-extrabold'>{formatCash(`${exam.price}`)} VNĐ</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div> */}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
