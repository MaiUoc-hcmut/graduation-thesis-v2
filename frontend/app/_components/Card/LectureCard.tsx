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

export const LectureCard = ({ lecture, index, innerRef, provided, data, setData, remove }: any) => {
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
    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<lectureData>(
        {
            defaultValues: {}
        }
    )
    return (
        <div ref={innerRef}  {...provided.draggableProps}  >
            <>
                <Modal show={modal[`delete-section${lecture.id}`]} size="md" onClose={() => setModal({ ...modal, [`delete-section${lecture.id}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={(e: any) => {
                            e.preventDefault()
                            setModal({ ...modal, [`delete-section${lecture.id}`]: false })
                            remove(index)
                            setData((data: any) => {
                                data.lectures?.splice(index, 1)
                                return data
                            })
                            notify()
                        }}>
                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Bạn có chắc muốn xóa mục này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit'>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete-section${lecture.id}`]: false })

                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>

            <>
                <Modal show={modal[`edit-section1${lecture.id}`]} size="md" onClose={() => setModal({ ...modal, [`edit-section1${lecture.id}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (data1: any) => {
                            if (!(Object.entries(errors).length === 0)) return
                            setModal({ ...modal, [`edit-section1${lecture.id}`]: false })
                            setData((data: any) => {
                                data.lectures[index].name = data1.name
                                data.lectures[index].status = data1.status

                                return data
                            })

                            notify()
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sửa mục</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Tên mục" />
                                </div>
                                <TextInput
                                    type="text"
                                    defaultValue={lecture.name}
                                    {...register(`name`, {
                                        required: "Tên không thể thiếu."
                                    })}
                                />
                                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.name?.message}
                                </div>
                            </div>
                            <div className="mt-2">
                                <label className="relative inline-flex items-center me-5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        defaultChecked={lecture.status}
                                        {...register(`status`)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Kích hoạt
                                    </span>
                                </label>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setModal({ ...modal, [`edit-section1${lecture.id}`]: false })}
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
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>


            <li className={`mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                <div className="mt-3">
                    <ul>
                        <li className="px-5 py-6 bg-white rounded-[0.625rem] border-[1px] border-[#ececec]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="flex justify-center items-center w-10 h-10 bg-[#f1f1f1] rounded-full mr-[10px]">
                                        <BookOpenIcon className="w-6 h-6 text-[#818894]" />
                                    </span>
                                    <div>
                                        <span className="font-bold text-[#171347] text-lg">
                                            Bài giảng 1: Tích phân
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button type="button" className="mr-[10px] ">
                                        <PlusCircleIcon className="w-7 h-7 text-primary" />
                                    </button>
                                    <button type="button" className="mr-[10px] text-yellow-400">
                                        <PencilSquareIcon className="w-6 h-6" />
                                    </button>
                                    <button type="button" className="mr-[10px] text-red-500">
                                        <TrashIcon className="w-6 h-6" />
                                    </button>
                                    <div className='flex justify-center items-center'  {...provided.dragHandleProps} >
                                        <button type="button" className="mr-[10px] text-[#a4c4fa]" style={{
                                        }} >
                                            <ArrowsPointingOutIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                    {
                                        !toggle["topic1"] ?
                                            <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                setToggle({ ...toggle, "topic1": true })
                                            }}>
                                                <ChevronDownIcon className="w-5 h-5" />
                                            </button>
                                            :
                                            <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                                setToggle({ ...toggle, "topic1": false })
                                            }}>
                                                <ChevronUpIcon className="w-5 h-5" />
                                            </button>
                                    }
                                </div>
                            </div>
                            {/* <div className={`${toggle["topic1"] ? "" : "hidden"}  mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                                    <div className="mt-3">
                                        <div className="mb-5 w-1/3">
                                            <label
                                                htmlFor="title"
                                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                            >
                                                Tiêu đề
                                            </label>
                                            <input
                                                style={{
                                                    border: '1px solid #ececec !important'
                                                }}
                                                type="text"
                                                id="title"
                                                name="title"
                                                className={`${!errors.title ? 'bg-white border border-[#ececec] text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'} text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                            />
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                {errors.title?.message}
                                            </p>
                                        </div>
                                        <div className="mb-5 w-1/2">
                                            <label
                                                htmlFor="title"
                                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                            >
                                                Mô tả
                                            </label>
                                            <textarea id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viết mô tả cho chủ đề..."></textarea>

                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                {errors.title?.message}
                                            </p>
                                        </div>
                                        <div className="mb-5 w-1/3">
                                            <label
                                                htmlFor="title"
                                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                            >
                                                Truy cập
                                            </label>
                                            <fieldset className="flex max-w-md gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Radio id="united-state" name="countries" value="USA" defaultChecked />
                                                    <Label htmlFor="united-state">Miễn phí</Label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Radio id="germany" name="countries" value="Germany" />
                                                    <Label htmlFor="germany">Trả phí</Label>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="mb-5 w-1/3">
                                            <label
                                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                                                htmlFor="cover"
                                            >
                                                Video
                                            </label>
                                            <input
                                                name="cover"
                                                {...register("cover", {
                                                    required: "Ảnh đại diện không thể trống."
                                                })}
                                                className={`${!errors.cover ? 'bg-white border border-gray-300 text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'}block w-full mb-2 text-xs rounded-lg cursor-pointe dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                                                id="cover"
                                                type="file"
                                            />
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                                {errors.cover?.message}
                                            </p>
                                        </div>
                                        <div className="mb-2">
                                            <button type="button"
                                                onClick={() => {
                                                    setToggle({ ...toggle, "topic1": false })
                                                }}
                                                className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                        </div>
                                    </div>
                                </div> */}
                        </li>
                    </ul>
                </div>
            </li>
        </div>

    )
}
