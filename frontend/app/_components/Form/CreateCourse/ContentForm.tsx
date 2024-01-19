"use client"

import { FormWrapper } from "./FormWrapper"
import { useCallback, useEffect, useState } from "react"
import { ChapterCard } from "../../Card/ChapterCard"
import { ToastContainer, toast } from 'react-toastify';
import { useFieldArray, useForm } from "react-hook-form";
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "../../React_Beautiful_Dnd/StrictModeDroppable";

type ChapterData = {
    id: string
    name: string
    description: string
    order: number
    status: boolean
    lectures: Array<LectureData>
}

type LectureData = {
    name: string
    description: string
    link_video: string
    status: Boolean
    order: number
}

type ContentFormData = {
    chapters: Array<ChapterData>
}

export function ContentForm({
    data,
    setData,
}: any) {
    const initToggle: any = {}
    const [modal, setModal] = useState(initToggle)

    const {
        register,
        control,
        setValue,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ContentFormData>(
        {
            defaultValues: {
                chapters: data.chapters
            }
        }
    )
    const [chaptersData, setChaptersData] = useState(data.chapters)

    useEffect(() => {
        setChaptersData(data.chapters)
    }, [data]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "chapters"
    });

    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };


    return (
        <FormWrapper title="">
            <ToastContainer />

            <form className="min-h-[250px]"
                onSubmit={handleSubmit(async (data1: any, e: any) => {
                    if (!(Object.entries(errors).length === 0)) return
                    setChaptersData(data1.chapters)
                    setModal({ ...modal, "add-section": false })
                    setData({ ...data, chapters: getValues().chapters })
                })}
            >
                <h2 className="text-[#171347] font-bold section-title text-lg">Nội dung</h2>
                <div>
                    <button type="button" onClick={() => {
                        append({
                            id: `${getValues().chapters.length}`,
                            name: "",
                            description: "",
                            order: 0,
                            status: false,
                            lectures: []
                        })
                        setModal({ ...modal, "add-section": true })

                    }} className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">

                        <div className="flex justify-center items-center">
                            Thêm mục
                        </div>

                    </button>
                </div>

                <div className={`${modal["add-section"] ? '' : 'hidden'} bg-white py-[30px] pl-[20px] pr-6 rounded-xl mb-5 mt-5`}>
                    <div className="">
                        <div className="w-1/3">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                            >
                                Tiêu đề
                            </label>
                            {fields.map((field: any, index: any) => (

                                index == fields.length - 1 ?
                                    <div key={field.id}>
                                        <input
                                            className="bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5"
                                            type="text"
                                            {...register(`chapters.${index}.name` as const, {
                                                required: "Tên không thể thiếu."
                                            })}

                                        />
                                        <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                            {errors?.chapters?.[index]?.name?.message}
                                        </div>

                                        <div className="mt-4">
                                            <label className="relative inline-flex items-center me-5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    {...register(`chapters.${index}.status`)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    Kích hoạt
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    : null

                            ))}

                        </div>

                        <div>
                            <button

                                type="submit"
                                className="mt-4 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => {
                                    setModal({ ...modal, "add-section": false })
                                    remove(fields.length - 1)
                                }}
                                type="button" className="ml-5 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-slate-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Hủy</button>
                        </div>
                    </div>

                </div>

                <div className="mt-5">
                    <div className="">
                        <DragDropContext onDragEnd={(result) => {
                            if (!result.destination) return;
                            const items: any = reorder(
                                chaptersData,
                                result.source.index,
                                result.destination.index
                            );
                            setChaptersData(items)
                        }}>
                            <StrictModeDroppable droppableId="chapter">
                                {(provided) => (
                                    <ul  {...provided.droppableProps} ref={provided.innerRef}>
                                        {
                                            chaptersData.map((chapter: any, index: any) => {
                                                return (

                                                    <Draggable key={chapter.id} index={index} draggableId={`${chapter.id}`}>
                                                        {
                                                            (provided) => (
                                                                <ChapterCard chapter={chaptersData[index]} register={register} handleSubmit={handleSubmit} errors={errors} index={index} innerRef={provided.innerRef} provided={provided} data={data} setData={setData} remove={remove} />
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
            </form>
        </FormWrapper >
    )
}