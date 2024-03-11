'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import examApi from "@/app/api/examApi"
import uuid from 'react-uuid';
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "@/app/_components/React_Beautiful_Dnd/StrictModeDroppable"
import { ChapterCard } from "@/app/_components/Card/EditCourse/ChapterCard"
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
    ExclamationCircleIcon, PencilSquareIcon, ArrowsPointingOutIcon, DocumentIcon,
    PlusCircleIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, BookOpenIcon
} from "@heroicons/react/24/outline"
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { QuestionCard } from "@/app/_components/Card/Exam/QuestionCard"
import { AnswerCard } from "@/app/_components/Card/Exam/AnswerCard"
import categoryApi from "@/app/api/category"

import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

type ExamData = {
    id: string,
    title: string
    period: number,
    status: string,
    grade: string,
    level: string,
    subject: string,
    questions: Array<QuestionData>
}

type QuestionData = {
    id: string
    content_text: string
    multi_choice: boolean
    answers: Array<AnswerData>
}

type AnswerData = {
    id: string
    content_text: string
    id_correct: boolean
}

type Category = {
    Class: [category]
    Subject: [category]
    Level: [category]
}

type category = {
    id: string
    name: string
}

const initCategory: Category = {
    Class: [{ id: "", name: "" }],
    Subject: [{ id: "", name: "" }],
    Level: [{ id: "", name: "" }]
}

export default function CreateExam() {
    const [examData, setExamData] = useState<ExamData>()
    const [toggle, setToggle] = useState<any>({})
    const [files, setFiles] = useState([])
    const [modal, setModal] = useState<any>({})
    const [questions, setQuestions] = useState([])

    const [category, setCategory] = useState<Category>(initCategory)
    const handleForm = useForm<ExamData>(
        {
            defaultValues: {
                id: uuid()
            }
        }
    )
    const {
        handleSubmit,
        setValue,
        getValues,
        register,
        control,
        formState: { errors },
    } = handleForm
    useEffect(() => {
        setExamData(examData)
    }, [examData]);
    useEffect(() => {
        async function fetchCategory() {
            await categoryApi.getAll().then((data: any) => setCategory(data))
        }
        fetchCategory()
    }, []);
    const { fields: fieldsQuestion, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: `questions`
    });

    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };



    const router = useRouter()
    console.log(questions);

    return (
        < div className="" >
            <>
                <Modal show={modal[`add_question`]} size="3xl" onClose={() => setModal({ ...modal, [`add_question`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (dataForm: any) => {
                            if (!(Object.entries(errors).length === 0)) return
                            setQuestions(dataForm.questions)

                            setModal({ ...modal, [`add_question`]: false })
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm câu hỏi</h3>

                            {fieldsQuestion?.map((field: any, indexQuestion: any) => (

                                indexQuestion == fieldsQuestion?.length - 1 ?
                                    <div key={field.id}>
                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="email" value="Tiêu đề câu hỏi" />
                                            </div>
                                            <TextInput
                                                type="text"
                                                {...register(`questions.${indexQuestion}.content_text`, {
                                                    required: "Tiêu đề câu hỏi không thể thiếu."
                                                })}
                                            />
                                            <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                {errors?.questions?.[indexQuestion]?.content_text?.message}
                                            </div>
                                        </div>
                                        <div className="mb-10 ">
                                            <div className="mb-2 block">
                                                <Label htmlFor="email" value="Ảnh (tùy chọn)" />
                                            </div>

                                            <FilePond
                                                files={files}
                                                onupdatefiles={() => setFiles}
                                                acceptedFileTypes={['image/*']}
                                                server={{
                                                    process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                                        const formData = new FormData();
                                                        formData.append(fieldName, file, file.name);
                                                        formData.append('data', JSON.stringify({
                                                            id_question: getValues().questions[indexQuestion].id,
                                                        }));


                                                        const request = new XMLHttpRequest();
                                                        request.open('POST', 'http://localhost:4002/api/v1/images')



                                                        request.upload.onprogress = (e) => {
                                                            progress(e.lengthComputable, e.loaded, e.total);
                                                        };

                                                        request.onload = function () {
                                                            if (request.status >= 200 && request.status < 300) {
                                                                // the load method accepts either a string (id) or an object
                                                                load(request.responseText);
                                                            } else {
                                                                // Can call the error method if something is wrong, should exit after
                                                                error('oh no');
                                                            }
                                                        };
                                                        request.send(formData)

                                                        // courseApi.uploadVideo(formData)
                                                    }
                                                }
                                                }

                                                name="image"
                                                labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                            />

                                        </div>
                                        <AnswerCard hanldeForm={handleForm} indexQuestion={indexQuestion} setModal={setModal} modal={modal} />
                                    </div>
                                    : null

                            ))}


                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, [`add_question`]: false })
                                        removeQuestion(fieldsQuestion?.length - 1)
                                    }
                                    }
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <div>
                                    <button
                                        type="submit"
                                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Tạo
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>
            <div className="flex flex-col ">
                <form onSubmit={
                    handleSubmit(async (dataForm: any) => {
                        console.log(dataForm);
                        const { thumbnail, cover, ...data1 } = dataForm
                        data1.categories = []

                        data1.categories.push(dataForm.grade)
                        data1.categories.push(dataForm.subject)
                        data1.categories.push(dataForm.level)
                        setExamData(dataForm)
                        await examApi.create({ data: data1 })

                    })
                }>
                    <h2 className="text-[#171347] font-bold section-title text-lg flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">Đề thi</h2>
                    <div className={`mt-5 `}>

                        <div className="">
                            <div className="mt-3">
                                <div className="mb-5 w-1/3">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Tiêu đề
                                    </label>
                                    <input
                                        {...register(`title`, { required: "Tiêu đề không thể thiếu." })}
                                        type="text"
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.title?.message}
                                    </p>
                                </div>
                                <div className="mb-5 w-1/3">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Thời gian (phút)
                                    </label>
                                    <input
                                        type="number"
                                        {...register(`period`, { required: "Thời gian không thể thiếu." })}
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.period?.message}
                                    </p>
                                </div>

                                <div className="mb-5 w-1/3">
                                    <label
                                        htmlFor="grade"
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Lớp học
                                    </label>
                                    <Controller
                                        control={control}
                                        name="grade"
                                        rules={{ required: "Lớp học không thể trống" }}
                                        render={({ field }) => (
                                            <select id="grade" {...field} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option value="" defaultChecked>Chọn lớp học</option>

                                                {category.Class?.map((cl, index) => {
                                                    return (
                                                        <option key={index} value={`${cl.id}`}>{cl.name}</option>
                                                    )
                                                })}
                                            </select>
                                        )}
                                    />
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors?.grade?.message}
                                    </p>
                                </div>
                                <div className="mb-5 w-1/3">
                                    <label
                                        htmlFor="subject"
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Môn học
                                    </label>

                                    <Controller
                                        control={control}
                                        name="subject"
                                        rules={{ required: "Môn học không thể trống" }}
                                        render={({ field }) => (
                                            <select {...field} id="subject" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option value="" defaultChecked>Chọn môn học</option>

                                                {category.Subject?.map((subject, index) => {
                                                    return (
                                                        <option key={index} value={`${subject.id}`} >{subject.name}</option>
                                                    )
                                                })}
                                            </select>
                                        )}
                                    />
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors?.subject?.message}
                                    </p>
                                </div>
                                <div className="mb-5 w-1/3">
                                    <label
                                        htmlFor="level"
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Mức độ
                                    </label>
                                    <Controller
                                        control={control}
                                        name="level"
                                        rules={{ required: "Mức độ không thể trống" }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                id="level" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option value="" defaultChecked>Chọn mức độ</option>

                                                {category.Level?.map((level, index) => {
                                                    return (
                                                        <option key={index} value={`${level.id}`} >{level.name}</option>
                                                    )
                                                })}
                                            </select>
                                        )}
                                    />
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors?.level?.message}
                                    </p>
                                </div>

                                <div className="mb-5 w-full">
                                    <div
                                        className="block mr-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Trạng thái
                                    </div>
                                    <div className="mt-2">
                                        <label className="relative inline-flex items-center me-5 cursor-pointer">
                                            <div className="flex">
                                                <div className="flex items-center me-4" >
                                                    <input
                                                        id="inline-radio"
                                                        type="radio"
                                                        defaultChecked
                                                        {...register(`status`)}
                                                        value="public"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <label
                                                        htmlFor="inline-radio"
                                                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                    >
                                                        Công khai
                                                    </label>
                                                </div>
                                                <div className="flex items-center me-4">
                                                    <input
                                                        id="inline-2-radio"
                                                        type="radio"
                                                        {...register(`status`)}
                                                        value="private"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <label
                                                        htmlFor="inline-2-radio"
                                                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                    >
                                                        Riêng tư
                                                    </label>
                                                </div>

                                            </div>
                                        </label>
                                    </div>


                                </div>
                                {/* 
                                        <div className="mb-2">
                                            <button
                                                onClick={() => {
                                                    remove(indexField)
                                                    setToggle({ ...toggle, [`add_exam`]: false })

                                                }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                            <button type="submit"
                                                onClick={() => {
                                                }}
                                                className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                        </div> */}
                            </div>
                            <div className='mt-4'>
                                <h2 className="text-[#171347] font-bold section-title flex items-center after:content-[''] after:flex after:grow after:shrink after:basis-4 after:h-[2px] after:ml-[10px] after:bg-[#f1f1f1]">Câu hỏi</h2>
                                <button type="button" onClick={() => {
                                    setModal({ ...modal, [`add_question`]: true })
                                    appendQuestion({
                                        id: uuid(),
                                        content_text: "",
                                        multi_choice: false,
                                        answers: [],
                                    })
                                }}
                                    className="mt-3 bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">
                                    Thêm câu hỏi
                                </button>
                                <div className='mt-5'>
                                    <DragDropContext onDragEnd={(result) => {
                                        if (!result.destination) return;
                                        const items: any = reorder(
                                            questions,
                                            result.source.index,
                                            result.destination.index
                                        );
                                        setQuestions(items)
                                        setValue(`questions`, items)
                                    }}>
                                        <StrictModeDroppable droppableId="question">
                                            {(provided) => (
                                                <ul {...provided.droppableProps} ref={provided.innerRef}>
                                                    {
                                                        questions?.map((question: any, indexQuestion: any) => {
                                                            return (
                                                                <Draggable key={question.id} index={indexQuestion} draggableId={`${question.id} `}>
                                                                    {
                                                                        (provided) => (

                                                                            <QuestionCard
                                                                                hanldeForm={handleForm} indexQuestion={indexQuestion} provided={provided} question={question} removeQuestion={removeQuestion} modal={modal} setModal={setModal} />
                                                                        )
                                                                    }
                                                                </Draggable>

                                                            )
                                                        })

                                                    }
                                                    {provided.placeholder}
                                                </ul>
                                            )
                                            }
                                        </StrictModeDroppable>
                                    </DragDropContext>


                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-between mt-5 pt-4 border-t-[1px] border-[#ececec]">
                        <button type="submit" className="bg-primary border border-primary text-white rounded-md shadow-primary_btn_shadow px-4 h-9 font-medium hover:bg-primary_hover">Hoàn thành</button>
                    </div>
                </form>
            </div >
        </ div >
    )

}



