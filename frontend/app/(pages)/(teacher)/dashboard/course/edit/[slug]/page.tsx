'use client'

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useMultistepForm } from "@/app/hooks/useMultiStep"
import { useRouter } from 'next/navigation'
import { BasicInfomationForm } from "@/app/_components/Form/EditCourse/BasicInfomationForm"
import { ContentForm } from "@/app/_components/Form/EditCourse/ContentForm"
import { useForm } from "react-hook-form"
import courseApi from "@/app/api/courseApi"
import { useFieldArray } from "react-hook-form";


type CourseData = {
    name: string
    subject: string
    grade: string
    level: string
    goal: string
    object: string
    description: string
    requirement: string
    price: string
    thumbnail: File
    cover: File
    chapters: Array<ChapterData>
}

type ChapterData = {
    id: string
    name: string
    lectures: Array<LectureData>
    status: Boolean
}

type LectureData = {
    id: string
    name: string
    description: string
    status: Boolean
    link_video: Array<File>
}


const INITIAL_DATA: CourseData = {
    name: "",
    subject: "",
    grade: "",
    level: "",
    goal: "",
    requirement: "",
    object: "",
    price: "",
    description: "",
    thumbnail: new File([], ""),
    cover: new File([], ""),
    chapters: [
        // {
        //     id: `a`,
        //     name: "",
        //     status: true,
        //     lectures: [{
        //         name: "",
        //         description: "",
        //         status: true
        //     }]
        // }
    ]
}

export default function EditCourse({ params }: { params: { slug: string } }) {
    const [data, setData] = useState(INITIAL_DATA)
    const [toggle, setToggle] = useState<any>({})
    const [typeSubmit, setTypeSubmit] = useState("")
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    const handleForm = useForm<CourseData>(
        {
            defaultValues: data
        }
    )

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = handleForm

    useEffect(() => {
        async function fetchCategory() {
            await courseApi.get(params.slug).then((data: any) => setData(data.data))
        }
        fetchCategory()
    }, [params.slug]);


    const router = useRouter()
    const { steps, step, isFirstStep, isLastStep, back, next, goTo } =
        useMultistepForm([
            // <BasicInfomationForm key={'step1'} handleForm={handleForm} />,
            <ContentForm key={'step2'} data={data} setData={setData} handleForm={handleForm} toggle={toggle} setToggle={setToggle} typeSubmit={typeSubmit} setTypeSubmit={setTypeSubmit} />,
        ], currentStepIndex, setCurrentStepIndex)

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
                <form onSubmit={
                    handleSubmit(async (dataForm: any) => {
                        if (!(Object.entries(errors).length === 0)) return
                        setToggle({ ...toggle, [`${typeSubmit}`]: false })
                        setData(dataForm)

                        console.log('submit', dataForm, errors);

                        const formData = new FormData();
                        // console.log(formData.get("file"));

                        dataForm.chapters.map((chapter: ChapterData, indexChapter: number) => {
                            chapter.lectures.map((lecture: LectureData, indexLecture: number) => {
                                // thumbnail, cover
                                formData.append(`${indexChapter}-${indexLecture}-video`, lecture.link_video[0], `${indexChapter}-${indexLecture}-${lecture.link_video[0].name}`)
                                console.log(formData.get(`${indexChapter}-${indexLecture}-video`), 111);
                            })
                        })

                        if (!isLastStep) return next()
                        // data = { ...data, thumbnail: data.thumbnail[0], cover: data.cover[0] }
                        // console.log(data, 111)\
                        // setData({ ...data, id_teacher: user.id })
                        // await courseApi.create(data)
                        // router.push("/teacher/course")
                    })
                }>

                    <div className="mt-5">
                        {step}
                    </div>

                    <div className="flex flex-row justify-between mt-5 pt-4 border-t-[1px] border-[#ececec]">
                        <div>
                            <button disabled={isFirstStep ? true : false} className={`${isFirstStep ? 'opacity-60' : ''} bg-primary mr-5 border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover" type="button`} onClick={back}>
                                Trang trước
                            </button>
                            <button className="bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover" type="submit">
                                Tiếp theo
                            </button>
                        </div>
                        <button type="submit" className="bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">Hoàn thành</button>
                    </div>
                </form>
            </div >
        </ div >
    )

}



