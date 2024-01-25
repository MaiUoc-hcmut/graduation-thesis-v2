"use client"

import Image from "next/image"
import Link from "next/link"
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'


export default function CourseDashboard() {
    return (
        <div className="">
            <div className="">
                <div className="font-bold text-[#171347] text-lg">Khóa học của tôi</div>
            </div>
            <div className="mt-8">
                <div className="rounded-[10px] flex bg-white">
                    <div className="min-h-[200px]">
                        <Image
                            src="/images/logo-course1.jpg"
                            width={300}
                            height={200}
                            alt="logo"
                            className="rounded-l-[10px] h-full w-full``"
                        />
                    </div>
                    <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                        <div className="flex justify-between items-center w-full">
                            <Link href="#" >
                                <h3 className="text-[#171347] font-bold text-lg">
                                    Toán nâng cao
                                    <span className="ml-3 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border-[1px] border-green-500">Cơ bản</span>
                                </h3>
                            </Link>
                            <button>
                                <Link href='course/edit/1'>
                                    <PencilSquareIcon className="w-6 h-6 text-gray-500" />
                                </Link>
                            </button>
                        </div>
                        <div className="flex items-center mt-4">
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">5.0</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-[20px] font-bold text-primary">Free</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between flex-wrap">
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-[10px] flex bg-white mt-8">
                    <div className="min-h-[200px]">
                        <Image
                            src="/images/logo-course1.jpg"
                            width={300}
                            height={200}
                            alt="logo"
                            className="rounded-l-[10px] h-full w-full``"
                        />
                    </div>
                    <div className="flex flex-col py-3 pl-[25px] pr-[17px] flex-1">
                        <div className="flex justify-between items-center w-full">
                            <Link href="#" >
                                <h3 className="text-[#171347] font-bold text-lg">
                                    Toán nâng cao
                                    <span className="ml-3 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border-[1px] border-green-500">Cơ bản</span>
                                </h3>
                            </Link>
                            <button>
                                <PencilSquareIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex items-center mt-4">
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <StarIcon className="w-5- h-5 text-[#ffc600] mr-[3px]" />
                            <span className="ml-[10px] bg-primary text-white text-xs font-medium me-2 px-1.5 py-0.5 rounded">5.0</span>
                        </div>
                        <div className="mt-4">
                            <span className="text-[20px] font-bold text-primary">Free</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between flex-wrap">
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                            <div className="flex items-center flex-col mt-[20px] mr-[15px]">
                                <span className="text-sm text-[#818894]">Item ID:</span>
                                <span className="text-sm text-[#171347]">2001</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
