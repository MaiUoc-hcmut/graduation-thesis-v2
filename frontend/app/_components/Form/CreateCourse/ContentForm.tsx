"use client"

import { FormWrapper } from "./FormWrapper"
import { useCallback, useEffect, useState } from "react"
import { Card } from "./Card"
import { ToastContainer, toast } from 'react-toastify';
import { useFieldArray, useForm } from "react-hook-form";
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";


import { StrictModeDroppable } from "./StrictModeDroppable";


export function ContentForm({
    register,
    errors,
    setValue,
    getValues,
    control,
    changeData,
    fields,
    append

}: any) {
    const initToggle: any = {}
    const [modal, setModal] = useState(initToggle)
    const [chaptersData, setChaptersData] = useState([])


    useEffect(() => {
        setChaptersData(getValues().chapters.slice(0, -1))
    }, [changeData, getValues]);

    // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    //     control, // control props comes from useForm (optional: if you are using FormContext)
    //     name: "chapters", // unique name for your Field Array
    // });

    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };


    return (
        <FormWrapper title="">
            <ToastContainer />




            <>
                {/* <Modal show={modal["add-section"]} size="md" onClose={() => setModal({ ...modal, "add-section": false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Thêm mục</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="Tên mục" />
                                </div>
                                {fields.map((field, index) => (
                                    index == fields.length - 1 ?
                                        <div key={field.id}>
                                            <input
                                                required
                                                name='name'
                                                id="name"
                                                type="text"
                                                {...register(`chapters.${index}.name` as const, {
                                                    required: "a"
                                                })}
                                            />
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                {errors?.chapters?.[index]?.name?.message}
                                            </p>
                                        </div>
                                        : null

                                ))}


                            </div>
                            <div className="mt-2">
                                <label className="relative inline-flex items-center me-5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultValue=""
                                        className="sr-only peer"
                                        defaultChecked
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Kích hoạt
                                    </span>
                                </label>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setModal({ ...modal, "add-section": false })
                                    }}
                                    type="button"
                                    className="mr-4 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        setChaptersData(getValues().chapters)
                                        append({
                                            id: `${getValues().chapters.length}`,
                                            name: "",
                                            description: "",
                                            order: 0,
                                            staus: false,
                                            lecutes: []
                                        })
                                        // setModal({ ...modal, "add-section": false })
                                    }}
                                    type="submit"
                                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal> */}
            </>


            <div>
                <h2 className="text-[#171347] font-bold section-title text-lg">Nội dung</h2>
                <div>
                    <button type="button" onClick={() => {
                        if (getValues().chapters.length == 0) {
                            append({
                                id: `0`,
                                name: "",
                                description: "",
                                order: 0,
                                status: false,
                                lecutes: []
                            })
                        }
                        setModal({ ...modal, "add-section": !modal["add-section"] })

                    }} className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">

                        <div className="flex justify-center items-center">
                            Thêm mục
                            <div className="ml-1 mt-1">
                                {!modal["add-section"] ?
                                    <ChevronDownIcon className="w-5 h-5" />
                                    :
                                    <ChevronUpIcon className="w-5 h-5" />
                                }
                            </div>
                        </div>

                    </button>
                </div>


                <div className={`${modal["add-section"] ? '' : 'hidden'} bg-white py-[30px] pl-[20px] pr-6 rounded-xl mb-5 mt-5`}>
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
                                        name='name'
                                        id="name"
                                        type="text"
                                        {...register(`chapters.${index}.name` as const, {
                                            required: "Tên không thể thiếu."
                                        })}

                                    />
                                    <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors?.chapters?.[index]?.name?.message}
                                    </div>

                                    <div>
                                    </div>

                                </div>
                                : null

                        ))}
                        <button
                            onClick={() => {

                                if (!errors?.chapters) {
                                    // setModal({ ...modal, "add-section": false })
                                }
                            }}
                            type="submit"
                            className="mt-4 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Lưu
                        </button>
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
                                                                <Card chapter={chaptersData[index]} index={index} innerRef={provided.innerRef} provided={provided} id={chapter.id} register={register} errors={errors} control={control} />
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
        </FormWrapper >
    )
}