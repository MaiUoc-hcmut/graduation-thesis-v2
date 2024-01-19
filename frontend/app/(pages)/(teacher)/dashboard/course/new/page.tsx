'use client'

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useMultistepForm } from "@/app/hooks/useMultiStep"
import { useRouter } from 'next/navigation'
import { BasicInfomationForm } from "@/app/_components/Form/CreateCourse/BasicInfomationForm"
import { ContentForm } from "@/app/_components/Form/CreateCourse/ContentForm"
import { useForm } from "react-hook-form"
import courseApi from "@/app/api/commentApi"
import { useFieldArray } from "react-hook-form";
import { error } from "console"
import { errorToJSON } from "next/dist/server/render"

type CourseData = {
    name: string
    subject: string
    grade: string
    level: string
    target: string
    goal: string
    object: string
    requirement: string
    price: string
    start_time: Date
    end_time: Date
    thumbnail: File
    cover: File
    chapters: Array<ChapterData>
}

type ChapterData = {
    id: string
    name: string
    description: string
    order: number
    lecutes: Array<LectureData>
    status: Boolean
}

type LectureData = {
    name: string
    description: string
    link_video: string
    status: Boolean
    order: number
}


const INITIAL_DATA: CourseData = {
    name: "",
    subject: "",
    grade: "",
    level: "",
    target: "",
    goal: "",
    requirement: "",
    object: "",
    price: "",
    start_time: new Date(),
    end_time: new Date(),
    thumbnail: new File([], ""),
    cover: new File([], ""),
    chapters: []
}

export default function CreateCourseStep() {
    const [data, setData] = useState(INITIAL_DATA)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)



    const router = useRouter()
    const { steps, step, isFirstStep, isLastStep, back, next, goTo } =
        useMultistepForm([
            // <BasicInfomationForm key={'step1'} data={data} setData={setData} setCurrentStepIndex={setCurrentStepIndex} />,
            <ContentForm key={'step2'} data={data} setData={setData} />,
        ], currentStepIndex, setCurrentStepIndex)

    console.log(data);


    return (
        < div className="" >
            <form>
                <div className="p-4 shadow-progress_bar_course flex rounded-md items-center bg-white">
                    <div className="flex items-center pr-6 ">
                        <button
                            onClick={() => {
                                goTo(0)
                            }}
                            type="button" className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStepIndex + 1 == 1 ? 'bg-[#9effc1]' : 'bg-[#f1f1f1]'}`}>
                            <Image
                                src="/images/icon-paper.svg"
                                width={28}
                                height={28}
                                alt="avatar"
                                className=''
                            />
                        </button>
                        <div className="ml-[10px]">
                            <span className="text-[0.875rem] text-[#818894]">Bước 1/8</span>
                            <h4 className="text-secondary font-bold">Thông tin cơ bản</h4>
                        </div>
                    </div>
                    <div className="flex items-center border-l-[1px] border-[#ececec] px-6">
                        <button onClick={() => goTo(1)} type="button" className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStepIndex + 1 == 2 ? 'bg-[#9effc1]' : 'bg-[#f1f1f1]'}`}>
                            <Image
                                src="/images/folder.svg"
                                width={28}
                                height={28}
                                alt="avatar"
                                className=''
                            />
                        </button>
                        <div className="ml-[10px]">
                            <span className="text-[0.875rem] text-[#818894]">Bước 2/8</span>
                            <h4 className="text-secondary font-bold">Nội dung khóa học</h4>
                        </div>
                    </div>
                </div>
            </form >

            <div className="flex flex-col ">
                {step}
                <form className={`${isLastStep ? '' : 'hidden'} mt-5 w-full`} onSubmit={(e: any) => {
                    e.preventDefault()
                    console.log('submit');

                    // if (!isLastStep) return next()
                    // data = { ...data, thumbnail: data.thumbnail[0], cover: data.cover[0] }
                    // console.log(data, 111)\
                    // setData({ ...data, id_teacher: user.id })
                    // await courseApi.create(data)
                    // router.push("/teacher/course")
                }} encType='multipart/form-data'>

                    <div className="flex flex-row justify-between">
                        {!isFirstStep && (
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" onClick={back}>
                                Trang trước
                            </button>
                        )}
                        {
                            isLastStep ? <button type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Hoàn thành</button> : null

                        }
                    </div>
                </form>
            </div >
        </ div >
    )

}



