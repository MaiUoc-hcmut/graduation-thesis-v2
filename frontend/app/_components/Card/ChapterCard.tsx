
import { useEffect, useRef, useState } from 'react'
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
import { LectureCard } from './LectureCard';

type LectureData = {
    name: string
    description: string
    link_video: string
    status: Boolean
    order: number
}


export const ChapterCard = ({ chapter, register, handleSubmit, errors, index, innerRef, provided, data, setData, remove }: any) => {
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

    const [lecturesData, setLecturesData] = useState(data.chapters[index] ? data.chapters[index] : [])

    useEffect(() => {
        setLecturesData(data.chapters[index] ? data.chapters[index] : [])
    }, [data]);
    console.log(lecturesData);


    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    // const {
    //     register,
    //     formState: { errors },
    //     handleSubmit,
    // } = useForm<LectureData>(
    //     {
    //         defaultValues: {}
    //     }
    // )
    return (
        <div ref={innerRef}  {...provided.draggableProps}  >
            <>
                <Modal show={modal[`delete-section${chapter.id}`]} size="md" onClose={() => setModal({ ...modal, [`delete-section${chapter.id}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={(e: any) => {
                            e.preventDefault()
                            setModal({ ...modal, [`delete-section${chapter.id}`]: false })
                            remove(index)
                            setData((data: any) => {
                                data.chapters?.splice(index, 1)
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
                                    setModal({ ...modal, [`delete-section${chapter.id}`]: false })

                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>

            <>
                <Modal show={modal[`edit-section1${chapter.id}`]} size="md" onClose={() => setModal({ ...modal, [`edit-section1${chapter.id}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (data1: any) => {
                            if (!(Object.entries(errors).length === 0)) return
                            setModal({ ...modal, [`edit-section1${chapter.id}`]: false })
                            setData((data: any) => {
                                data.chapters[index].name = data1.name
                                data.chapters[index].status = data1.status

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
                                    defaultValue={chapter.name}
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
                                        defaultChecked={chapter.status}
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
                                    onClick={() => setModal({ ...modal, [`edit-section1${chapter.id}`]: false })}
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

            <li className="bg-white py-[30px] pl-[20px] pr-6 rounded-xl mb-5" >
                <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center">
                        <span className="flex justify-center items-center w-10 h-10 min-w-10 min-h-10 bg-primary rounded-full mr-[10px]">
                            <Squares2X2Icon className="w-6 h-6 text-white" />
                        </span>
                        <div>
                            <span className="font-bold text-[rgb(23,19,71)] text-lg">
                                Chương {chapter.id}: {chapter.name}
                            </span>
                            <span className="font-normal text-[818894] text-xs flex">
                                3 chủ đề
                                | 0:00 giờ
                            </span>
                        </div>
                    </div>
                    <div className="ml-5 flex items-center justify-center">

                        <div className="mr-[10px]" >


                            <Dropdown label="" renderTrigger={() => <PlusCircleIcon className="w-7 h-7 text-primary" />} placement="left">
                                <Dropdown.Item onClick={() => {
                                    setToggle({ ...toggle, [`add-lecture-${chapter.id}`]: true })
                                }}>
                                    Thêm chủ đề
                                </Dropdown.Item>
                                <Dropdown.Item>Thêm đề thi</Dropdown.Item>
                            </Dropdown>

                        </div>
                        <button type="button" className="mr-[10px] text-yellow-400"
                            onClick={() => { setModal({ ...modal, [`edit-section1${chapter.id}`]: true }) }}>
                            <PencilSquareIcon className="w-6 h-6" />
                        </button>
                        <button type="button" className="mr-[10px] text-red-500">
                            <TrashIcon className="w-6 h-6" onClick={() => setModal({ ...modal, [`delete-section${chapter.id}`]: true })} />
                        </button>

                        <div className='flex justify-center items-center'  {...provided.dragHandleProps} >
                            <button type="button" className="mr-[10px] text-[#a4c4fa]" style={{
                            }} >
                                <ArrowsPointingOutIcon className="w-6 h-6" />
                            </button>
                        </div>
                        {
                            !toggle["section1"] ?
                                <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                    setToggle({ ...toggle, "section1": true })
                                }}>
                                    <ChevronDownIcon className="w-5 h-5" />
                                </button>
                                :
                                <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                    setToggle({ ...toggle, "section1": false })
                                }}>
                                    <ChevronUpIcon className="w-5 h-5" />
                                </button>
                        }

                    </div>
                </div>




                <div className={`${toggle[`add-lecture-${chapter.id}`] ? "" : "hidden"}  mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                    {/* <form className="" onSubmit={
                        handleSubmit(async (data1: any) => {
                            console.log(data1);
                            if (!(Object.entries(errors).length === 0)) return
                            setToggle({ ...toggle, [`add-lecture-${chapter.id}`]: false })

                            // setData((data: any) => {
                            //     data.chapters[index].name = data1.name
                            //     data.chapters[index].status = data1.status

                            //     return data
                            // })

                            notify()
                        })

                    }>


                    </form> */}
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
                                {...register(`chapters.${index}.lectures.0.name`, {
                                    required: "Ảnh đại diện không thể trống."
                                })}
                                type="text"
                                id="title"
                                name="title"
                                className={`${!errors?.name ? 'bg-white border border-[#ececec] text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'} text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                            />
                            {/* <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.chapters.${index}.lectures.0.name.message}
                            </p> */}
                        </div>
                        <div className="mb-5 w-1/2">
                            <label
                                htmlFor="title"
                                className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                            >
                                Mô tả
                            </label>
                            <textarea
                                id="message"
                                {...register("description", {
                                    required: "Ảnh đại diện không thể trống."
                                })}
                                rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viết mô tả cho chủ đề..."></textarea>

                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.name?.message}
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
                                {...register("link_video", {
                                    required: "Ảnh đại diện không thể trống."
                                })}
                                className={`${!errors.link_video ? 'bg-white border border-gray-300 text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'}block w-full mb-2 text-xs rounded-lg cursor-pointe dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                                id="cover"
                                type="file"
                            />
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                {errors.link_video?.message}
                            </p>
                        </div>
                        <div className="mb-2">
                            <button
                                onClick={() => {
                                    setToggle({ ...toggle, [`add-lecture-${chapter.id}`]: false })

                                }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                            <button type="submit"
                                className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                        </div>
                    </div>
                </div>





                <div className={`${toggle["section1"] ? "" : "hidden"}`}>
                    <DragDropContext onDragEnd={(result) => {
                        if (!result.destination) return;
                        const items: any = reorder(
                            lecturesData,
                            result.source.index,
                            result.destination.index
                        );
                        setLecturesData(items)
                    }}>
                        <StrictModeDroppable droppableId="chapter">
                            {(provided) => (
                                <ul  {...provided.droppableProps} ref={provided.innerRef}>
                                    {
                                        // lecturesData?.map((chapter: any, index: any) => {
                                        //     return (


                                        //     )
                                        // })
                                        <Draggable key={0} index={index} draggableId={`${chapter.id}`}>
                                            {
                                                (provided) => (
                                                    <LectureCard

                                                        lecture={{ id: '1' }} index={index} innerRef={provided.innerRef} provided={provided} data={data} setData={setData} remove={remove} />
                                                )
                                            }
                                        </Draggable>
                                    }
                                    {provided.placeholder}
                                </ul>
                            )
                            }
                        </StrictModeDroppable>
                    </DragDropContext>
                </div>
            </li>
        </div>

    )
}
