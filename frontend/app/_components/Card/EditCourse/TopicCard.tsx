import { useRef, useState } from 'react'
import {
    ExclamationCircleIcon, PencilSquareIcon, ArrowsPointingOutIcon, Squares2X2Icon,
    PlusCircleIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, BookOpenIcon
} from "@heroicons/react/24/outline"

import { Dropdown } from 'flowbite-react';
import { Button, Modal } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import ReactPlayer from 'react-player';
import { FilePond, registerPlugin } from 'react-filepond'

import 'filepond/dist/filepond.min.css'


import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import Link from 'next/link';


export const TopicCard = ({ chapter, topic, indexChapter, indexTopic, hanldeForm, innerRef, provided, data, setData,
    removeTopic, setTypeSubmit, id_course }: any) => {
    const initToggle: any = {}
    const [toggle, setToggle] = useState(initToggle)
    const [modal, setModal] = useState(initToggle)
    const [files, setFiles] = useState()
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
    const {
        register,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = hanldeForm

    return (
        <div ref={innerRef} {...provided.draggableProps}  >
            <>
                <Modal show={modal[`delete-topic${topic.id || topic.key}`]} size="md" onClose={() => setModal({ ...modal, [`delete-topic${topic.id || topic.key}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={(e: any) => {
                            e.preventDefault()

                            if (chapter.modify != "create" && chapter.topics[indexTopic].modify != "create") {
                                setValue(`chapters.${indexChapter}.topics.${indexTopic}.modify`, "delete")
                                setValue(`chapters.${indexChapter}.modify`, 'change')
                            }
                            if (chapter.topics[indexTopic].modify == "create") {
                                removeTopic(indexTopic)
                                setData((data: any) => {
                                    data.chapters[indexChapter].topics?.splice(indexTopic, 1)
                                    return data
                                })
                            }
                            setModal({ ...modal, [`delete-topic${topic.id || topic.key}`]: false })
                            notify()
                        }}>
                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                Bạn có chắc muốn xóa chủ đề này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit'>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete-topic${topic.id || topic.key}`]: false })
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
                                    {topic.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            {/* <button type="button" className="mr-[10px] ">
                                <PlusCircleIcon className="w-7 h-7 text-primary" />
                            </button> */}
                            <button type="button" className="mr-[10px] text-red-500">
                                <TrashIcon className="w-6 h-6"
                                    onClick={() => {
                                        setModal({ ...modal, [`delete-topic${topic.id || topic.key}`]: true })
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
                                !toggle[`edit_topic_${topic.id || topic.key}`] ?
                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                        setToggle({ ...toggle, [`edit_topic_${topic.id || topic.key}`]: true })
                                    }}>
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </button>
                                    :
                                    <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                        setToggle({ ...toggle, [`edit_topic_${topic.id || topic.key}`]: false })
                                    }}>
                                        <ChevronUpIcon className="w-5 h-5" />
                                    </button>
                            }
                        </div>
                    </div>

                    <div className={`${toggle[`edit_topic_${topic.id || topic.key}`] ? "" : "hidden"}  mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                        <div className="mt-3">
                            <div className="mb-5 w-1/3">
                                <label
                                    htmlFor="title"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Tiêu đề
                                </label>
                                <input
                                    {...register(`chapters.${indexChapter}.topics.${indexTopic}.name`, {
                                        required: "Tên bài giảng không thể thiếu",
                                    })}
                                    type="text"
                                    className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                />

                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors.chapters?.[indexChapter]?.topics?.[indexTopic]?.name?.message}
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
                                    {...register(`chapters.${indexChapter}.topics.${indexTopic}.description`)}
                                    rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viết mô tả cho chủ đề..."></textarea>

                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors.chapters?.[indexChapter]?.topics?.[indexTopic]?.description?.message}
                                </p>
                            </div>
                            <div className='w-1/2'>
                                <label
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                                    htmlFor="video"
                                >
                                    Video bài giảng
                                </label>
                                <FilePond
                                    files={files}
                                    onupdatefiles={() => setFiles}
                                    acceptedFileTypes={['video/*']}
                                    server={{
                                        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                            const formData = new FormData();
                                            formData.append(fieldName, file, `${indexChapter + 1}-${indexTopic + 1}-${file.name}`);
                                            const data = { id_course: id_course }
                                            console.log(formData.get('video'));

                                            formData.append('data', JSON.stringify(data));

                                            const request = new XMLHttpRequest();
                                            request.open('POST', 'http://localhost:4001/api/v1/videos')

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
                                            request.send(formData);
                                            // courseApi.uploadVideo(formData)
                                        }
                                    }
                                    }

                                    name="video"
                                    labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                />
                                {
                                    topic?.video ?
                                        <div className='my-10 p-2 bg-black'>

                                            <ReactPlayer width='100%' height='240px' controls={true} url={`${topic?.video}}`} />
                                        </div>
                                        : null

                                }

                            </div>
                            <div className="mb-5 w-1/2">
                                <label
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                                    htmlFor="video"
                                >
                                    Tài liệu
                                </label>
                                <FilePond
                                    files={files}
                                    onupdatefiles={() => setFiles}
                                    allowMultiple
                                    // acceptedFileTypes={[".pdf"]}
                                    server={{
                                        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                            const formData = new FormData();
                                            formData.append(fieldName, file, file.name);
                                            const data = { id_course: id_course, id_topic: topic.id }

                                            formData.append('data', JSON.stringify(data));

                                            const request = new XMLHttpRequest();
                                            request.open('PUT', 'http://localhost:4001/api/v1/document/update')

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
                                            request.send(formData);
                                            // courseApi.uploadVideo(formData)
                                        }
                                    }
                                    }

                                    name="document"
                                    labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                                />
                                {
                                    topic?.Documents?.map((document: any) => {
                                        return (
                                            <div key={document.id}>
                                                <p className='pb-2'>{document.name}</p>
                                            </div>
                                        )
                                    })
                                }
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
                                                    {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
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
                                                    {...register(`chapters.${indexChapter}.topics.${indexTopic}.status`)}
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

                            <div className="mb-2">
                                <button
                                    onClick={() => {
                                        setToggle({ ...toggle, [`edit_topic_${topic.id || topic.key}`]: false })
                                        reset({ [`chapters.${indexChapter}.topics.${indexTopic}`]: {} })

                                    }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                <button type="submit" onClick={() => {
                                    setToggle({ ...toggle, [`edit_topic_${topic.id || topic.key}`]: false })
                                    setTypeSubmit(`edit_topic_${topic.id || topic.key}`)
                                    if (chapter.modify != "create") {
                                        setValue(`chapters.${indexChapter}.topics.${indexTopic}.modify`, 'change')
                                        setValue(`chapters.${indexChapter}.modify`, 'change')
                                    }
                                    notify()
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
