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

type FormData = {
    title: string
    subject: string
    grade: string
    level: string
    target: string
    goal: string
    object: string
    method: string
    price: string
    start_time: Date
    end_time: Date
    thumbnail: File
    chapters: Object
}

const INITIAL_DATA: FormData = {
    title: "",
    subject: "",
    grade: "",
    level: "",
    target: "",
    goal: "",
    method: "",
    object: "",
    price: "",
    start_time: new Date(),
    end_time: new Date(),
    thumbnail: new File([], ""),
    chapters: {}
}

export default function CreateCourseStep() {
    const [data, setData] = useState(INITIAL_DATA)

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    const router = useRouter()
    function updateFields(fields: Partial<FormData>) {
        setData(prev => {
            return { ...prev, ...fields }
        })
    }
    const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
        useMultistepForm([
            <BasicInfomationForm {...data} key={'step1'} register={register} errors={errors} />,
            <ContentForm {...data} key={'step2'} register={register} errors={errors} />,
        ])

    return (
        < div className="" >
            <form>
                <div className="p-4 shadow-progress_bar_course flex rounded-md items-center block bg-white">
                    <div className="flex items-center pr-6 ">
                        <button className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStepIndex + 1 == 1 ? 'bg-[#9effc1]' : 'bg-[#f1f1f1]'}`}>
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
                        <button className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStepIndex + 1 == 2 ? 'bg-[#9effc1]' : 'bg-[#f1f1f1]'}`}>
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
            </form>
            <div className="flex flex-row">
                <form onSubmit={handleSubmit(async (data) => {
                    if (!isLastStep) return next()
                    // setData({ ...data, id_teacher: user.id })
                    await courseApi.create(data)
                    // router.push("/teacher/course")
                    console.log(data)
                })} encType='multipart/form-data' className="mt-5 w-full">
                    {step}
                    <div className="flex flex-row justify-between my-10">
                        {!isFirstStep && (
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" onClick={back}>
                                Trang trước
                            </button>
                        )}
                        {
                            isLastStep ? <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Hoàn thành</button> : <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Tiếp theo</button>
                        }


                    </div>
                </form>
            </div>
        </ div>
    )

}



