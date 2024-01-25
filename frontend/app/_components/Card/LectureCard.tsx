import { useRef, useState } from 'react'
import {
    ExclamationCircleIcon, PencilSquareIcon, ArrowsPointingOutIcon, Squares2X2Icon,
    PlusCircleIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, BookOpenIcon
} from "@heroicons/react/24/outline"

import { Dropdown } from 'flowbite-react';
import { Button, Checkbox, Label, Modal, TextInput, Radio } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import { useFieldArray, useForm } from 'react-hook-form';
import { DragDropContext, Draggable, Droppable, DroppableProps } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "../React_Beautiful_Dnd/StrictModeDroppable";

type lectureData = {
    id: string
    name: string
    status: boolean
}

export const LectureCard = ({ chapter, lecture, index, indexLecture, innerRef, provided, data, setData, register, errors, watch, removeLecture, reset }: any) => {
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const [modal, setModal] = useState(initToggle)
    const notify = () => {
        toast.success('Thành công', {
            position: "bottom-right",
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    return (
        <div ref={innerRef} {...provided.draggableProps}  >
            <>
                <Modal show={modal[`delete-lecture${lecture.id}`]} size="md" onClose={() => setModal({ ...modal, [`delete-lecture${lecture.id}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={(e: any) => {
                            e.preventDefault()
                            setModal({ ...modal, [`delete-lecture${lecture.id}`]: false })
                            removeLecture(index)
                            setData((data: any) => {
                                data.chapters.lectures?.splice(index, 1)
                                return data
                            })
                            notify()
                        }}>
                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                Bạn có chắc muốn xóa mục này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit'>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete-lecture${lecture.id}`]: false })

                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>


            <li className={`mt-6 pt-4 border-t-[1px] border-[#ececec]`}>
                <div className="px-5 py-6 bg-white rounded-[0.625rem] border-[1px] border-[#ececec]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="flex justify-center items-center w-10 h-10 bg-[#f1f1f1] rounded-full mr-[10px]">
                                <BookOpenIcon className="w-6 h-6 text-[#818894]" />
                            </span>
                            <div>
                                <span className="font-bold text-[#171347] text-lg">
                                    Bài giảng {lecture.id}: {lecture.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <button type="button" className="mr-[10px] ">
                                <PlusCircleIcon className="w-7 h-7 text-primary" />
                            </button>
                            <button type="button" className="mr-[10px] text-red-500">
                                <TrashIcon className="w-6 h-6"
                                    onClick={() => {
                                        setModal({ ...modal, [`delete-lecture${lecture.id}`]: true })
                                    }}
                                />
                            </button>
                            <div className='flex justify-center items-center'  {...provided.dragHandleProps} >
                                <button type="button" className="mr-[10px] text-[#a4c4fa]" style={{
                                }} >
                                    <ArrowsPointingOutIcon className="w-6 h-6" />
                                </button>
                            </div>
                            {
                                !toggle[`edit_lecture_${lecture.id}`] ?
                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                        setToggle({ ...toggle, [`edit_lecture_${lecture.id}`]: true })
                                    }}>
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </button>
                                    :
                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                        setToggle({ ...toggle, [`edit_lecture_${lecture.id}`]: false })
                                    }}>
                                        <ChevronUpIcon className="w-5 h-5" />
                                    </button>
                            }
                        </div>
                    </div>
                    <div className={`${toggle[`edit_lecture_${lecture.id}`] ? "" : "hidden"}  mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                        <div className="mt-3">
                            <div className="mb-5 w-1/3">
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Tiêu đề
                                </label>
                                <input
                                    {...register(`chapters.${index}.lectures.${indexLecture}.name`, {
                                        required: "Tên bài giảng không thể thiếu",
                                    })}
                                    type="text"
                                    className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                />

                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors.chapters?.[index]?.lectures?.[indexLecture]?.name?.message}
                                </p>
                            </div>
                            <div className="mb-5 w-1/2">
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Mô tả
                                </label>
                                <textarea
                                    {...register(`chapters.${index}.lectures.${indexLecture}.description`, {
                                        required: "Mô tả không thể thiếu",
                                    })}
                                    rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viết mô tả cho chủ đề..."></textarea>

                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors.chapters?.[index]?.lectures?.[indexLecture]?.description?.message}
                                </p>
                            </div>

                            <div className="mb-5 w-1/3">
                                <label
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                                    htmlFor="cover"
                                >
                                    Video
                                </label>
                                <input
                                    {...register(`chapters.${index}.lectures.${indexLecture}.link_video`)}
                                    className={`bg-white border border-gray-300 text-[#343434] block w-full mb-2 text-xs rounded-lg cursor-pointer focus:outline-none`}
                                    type="file"
                                />
                            </div>

                            <div className="mb-2">
                                <button
                                    onClick={() => {
                                        setToggle({ ...toggle, [`edit_lecture_${lecture.id}`]: false })
                                        reset({ [`chapters.${index}.lectures.${indexLecture}`]: {} })

                                    }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                <button type="submit"
                                    disabled={watch([`chapters.${index}.lectures.${indexLecture}.name`]) == '' ? true : false}
                                    onClick={() => {
                                        // appendLecture({
                                        //     id: `lecture_${lecturesData.length}`,
                                        //     name: "",
                                        //     description: "",
                                        //     status: true
                                        // })
                                        if (!errors.chapters?.[index]?.lectures?.[indexLecture]) {
                                            setToggle({ ...toggle, [`edit_lecture_${lecture.id}`]: false })
                                        }
                                    }}
                                    className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

        </div>

    )
}
