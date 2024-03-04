"use client"

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon, ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import Image from 'next/image';
import courseApi from '@/app/api/courseApi';
import categoryApi from '@/app/api/category'
import { useSearchParams } from 'next/navigation'
import { formatCash } from '@/app/helper/FormatFunction'


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

export default function CourseList() {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [courses, setCourses] = useState([])
    const [category, setCategory] = useState<[any]>([])
    const searchParams = useSearchParams()
    const subjectFilters = searchParams.getAll('subject')
    const levelFilters = searchParams.getAll('level')
    const classFilters = searchParams.getAll('class')

    useEffect(() => {
        async function fetchData() {
            let filterString = ''
            subjectFilters.map((s) => { filterString += `subject=${s}&` })
            levelFilters.map((l) => { filterString += `subject=${l}&` })
            classFilters.map((c) => { filterString += `subject=${c}&` })

            if (subjectFilters.length != 0 || levelFilters.length != 0 || classFilters.length != 0) {
                await courseApi.filter(filterString).then((data: any) => {
                    setCourses(data.data)
                }
                )
            }
            else {
                await courseApi.getAll().then((data: any) => {
                    setCourses(data.data)
                }
                )
            }
            await categoryApi.getAll().then((data: any) => {
                setCategory([
                    {
                        id: "subject",
                        name: "Môn học",
                        options: data.Subject
                    },
                    {
                        id: "level",
                        name: "Mức độ",
                        options: data.Level
                    },
                    {
                        id: "class",
                        name: "Lớp",
                        options: data.Class
                    },

                ])
            })

        }
        fetchData()
    }, [])

    console.log(category, courses);


    return (
        <div className="bg-white container mx-auto">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4 border-t border-gray-200">
                                        <h3 className="sr-only">Categories</h3>

                                        {category.map((section) => (
                                            <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
                                                {({ open }) => (
                                                    <>
                                                        <h3 className="-mx-2 -my-3 flow-root">
                                                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
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
                                                        <Disclosure.Panel className="pt-6">
                                                            <div className="space-y-6">
                                                                {section.options.map((option, optionIdx) => (
                                                                    <div key={option.value} className="flex items-center">
                                                                        <input
                                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            name={`${section.id}[]`}
                                                                            defaultValue={option.name}
                                                                            type="checkbox"
                                                                            defaultChecked={option.checked}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                        />

                                                                        <label
                                                                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                            className="ml-3 min-w-0 flex-1 text-gray-500"
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


                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Khóa học</h1>

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
                                onClick={() => setMobileFiltersOpen(true)}
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

                                {category.map((section) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
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
                                                <Disclosure.Panel className="pt-6">
                                                    <div className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.id} className="flex items-center">
                                                                <input
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}`}
                                                                    defaultValue={option.id}
                                                                    type="checkbox"
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
                                                                <span className='text-[#171347] font-medium text-sm'>{course.totalDuration} giờ</span>
                                                            </div>
                                                            <div className='flex items-center'>
                                                                <Squares2X2Icon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                <span className='text-[#171347] font-medium text-sm'>{course?.chapters?.length} chương</span>
                                                            </div>
                                                            <div className='flex items-center'>
                                                                <FilmIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                <span className='text-[#171347] font-medium text-sm'>{course?.total_lecture} bài giảng</span>
                                                            </div>
                                                            <div className='flex items-center'>
                                                                <DocumentTextIcon className='w-5 h-5 text-secondary font-medium mr-1' />
                                                                <span className='text-[#171347] font-medium text-sm'>{course?.total_exam} đề thi</span>
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
                                <div className='mt-20 flex justify-center'>
                                    <nav aria-label="Page navigation example">
                                        <ul className="inline-flex -space-x-px text-base h-10">
                                            <li>
                                                <Link
                                                    href="#"
                                                    className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                >
                                                    Trước
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="#"
                                                    className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                >
                                                    1
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="#"
                                                    className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                >
                                                    2
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="#"
                                                    aria-current="page"
                                                    className="flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                                >
                                                    3
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="#"
                                                    className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                >
                                                    4
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="#"
                                                    className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                >
                                                    5
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="#"
                                                    className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                >
                                                    Sau
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>

                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
