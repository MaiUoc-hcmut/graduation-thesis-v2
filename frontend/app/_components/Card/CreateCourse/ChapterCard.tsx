
import { useEffect, useRef, useState } from 'react'
import {
    ExclamationCircleIcon, PencilSquareIcon, ArrowsPointingOutIcon, Squares2X2Icon,
    PlusCircleIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, BookOpenIcon
} from "@heroicons/react/24/outline"
import { convertTime } from '@/app/helper/FormatFunction'
import { Dropdown } from 'flowbite-react';
import { Button, Checkbox, Label, Modal, TextInput, Radio } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import { useFieldArray, useForm } from 'react-hook-form';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "../../React_Beautiful_Dnd/StrictModeDroppable";
import { TopicCard } from './TopicCard';


// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import courseApi from "@/app/api/courseApi";


// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

export const ChapterCard = ({ chapter, handleForm, indexChapter, innerRef, provided, data, setData, removeChapter, setTypeSubmit, toggle, setToggle, id_course }: any) => {
    const [modal, setModal] = useState<any>({})
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
        control,
        getValues,
        setValue,
        watch,
        reset,
        handleSubmit,
        formState: { errors },
    } = handleForm

    const { fields: fieldsTopic, append: appendTopic, remove: removeTopic } = useFieldArray({
        control,
        name: `chapters.${indexChapter}.topics`
    });

    const [topicsData, setTopicsData] = useState(chapter.topics)
    const [files, setFiles] = useState([])

    useEffect(() => {
        const topics = chapter?.topics
        if (topics && topics[topics?.length - 1]?.name === "")
            setTopicsData(chapter.topics.slice(0, -1))
        else
            setTopicsData(chapter.topics)
    }, [chapter.topics, data]);


    const reorder = (list: Array<any>, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    console.log(errors);

    return (
        <div ref={innerRef}  {...provided.draggableProps}  >
            <>
                <Modal show={modal[`delete_section${chapter.key}`]} size="md" onClose={() => setModal({ ...modal, [`delete_section${chapter.key}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={(e: any) => {
                            e.preventDefault()
                            setModal({ ...modal, [`delete_section${chapter.key}`]: false })
                            removeChapter(indexChapter)
                            setData((data: any) => {
                                data.chapters?.splice(indexChapter, 1)
                                return data
                            })
                            notify()
                        }}>
                            <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg text-center font-normal text-gray-500 dark:text-gray-400">
                                Bạn có chắc muốn xóa mục này?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type='submit'>
                                    Xóa
                                </Button>
                                <Button color="gray" onClick={() => {
                                    setModal({ ...modal, [`delete_section${chapter.key}`]: false })

                                }}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </>

            <>
                <Modal show={modal[`edit_section_${chapter.key}`]} size="md" onClose={() => setModal({ ...modal, [`edit_section_${chapter.key}`]: false })} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <form className="space-y-6" onSubmit={handleSubmit(async (data1: any) => {
                            if (!(Object.entries(errors).length === 0)) return
                            setModal({ ...modal, [`edit_section_${chapter.key}`]: false })
                            setData((data: any) => {
                                data.chapters[indexChapter].name = data1.chapters[indexChapter].name
                                data.chapters[indexChapter].status = data1.chapters[indexChapter].status
                                return data
                            })

                            setTypeSubmit(`edit_section_${chapter.key}`)
                            notify()
                        })}>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sửa mục</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Tên mục" />
                                </div>
                                <TextInput
                                    type="text"
                                    {...register(`chapters.${indexChapter}.name`, {
                                        required: "Tên mục không thể thiếu."
                                    })}
                                />
                                <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {errors?.chapters?.[indexChapter]?.name?.message}
                                </div>
                            </div>

                            <div className="mt-2 w-full">
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
                                                    {...register(`chapters.${indexChapter}.status`)}
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
                                                    {...register(`chapters.${indexChapter}.status`)}
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
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        reset({ [`chapters.${indexChapter}`]: {} })
                                        setModal({ ...modal, [`edit_section_${chapter.key}`]: false })
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
                                {chapter.name}
                            </span>
                            <span className="font-normal text-[818894] text-xs flex">
                                {chapter?.topics?.length} chủ đề
                                | {convertTime(0 && getValues().totalDuration)}
                            </span>
                        </div>
                    </div>
                    <div className="ml-5 flex items-center justify-center">

                        <div className="mr-[10px]" >


                            <Dropdown label="" renderTrigger={() => <PlusCircleIcon className="w-7 h-7 text-primary" />} placement="left">
                                <Dropdown.Item onClick={() => {

                                    appendTopic({
                                        key: `lecture_${topicsData.length}`,
                                        name: "",
                                        title: "a",
                                        description: "",
                                        duration: 0,
                                        status: "public",
                                        type: "lecture"
                                    })
                                    setToggle({ ...toggle, [`add_lecture_${chapter.key}`]: true, [`open_chapter_${chapter.key}`]: true })
                                }}>
                                    Thêm bài giảng
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => {

                                    appendTopic({
                                        key: `exam_${topicsData.length}`,
                                        title: "",
                                        name: "a",
                                        duration: 0,
                                        status: "public",
                                        type: "exam"
                                    })
                                    setToggle({ ...toggle, [`add_exam_${chapter.key}`]: true, [`open_chapter_${chapter.key}`]: true })
                                }}>Thêm bài tập</Dropdown.Item>
                            </Dropdown>

                        </div>
                        <button type="button" className="mr-[10px] text-yellow-400"
                            onClick={() => { setModal({ ...modal, [`edit_section_${chapter.key}`]: true }) }}>
                            <PencilSquareIcon className="w-6 h-6" />
                        </button>
                        <button type="button" className="mr-[10px] text-red-500">
                            <TrashIcon className="w-6 h-6" onClick={() => setModal({ ...modal, [`delete_section${chapter.key}`]: true })} />
                        </button>

                        <div className='flex justify-center items-center'  {...provided.dragHandleProps} >
                            <button type="button" className="mr-[10px] text-[#a4c4fa]" style={{
                            }} >
                                <ArrowsPointingOutIcon className="w-6 h-6" />
                            </button>
                        </div>
                        {
                            !toggle[`open_chapter_${chapter.key}`] ?
                                <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                    setToggle({ ...toggle, [`open_chapter_${chapter.key}`]: true })
                                }}>
                                    <ChevronDownIcon className="w-5 h-5" />
                                </button>
                                :
                                <button type="button" className="mr-[10px] text-[#818894]" onClick={() => {
                                    setToggle({ ...toggle, [`open_chapter_${chapter.key}`]: false })
                                }}>
                                    <ChevronUpIcon className="w-5 h-5" />
                                </button>
                        }

                    </div>
                </div>




                <div className={`${toggle[`add_lecture_${chapter.key}`] ? "" : "hidden"} mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                    {fieldsTopic.map((field: any, indexFieldTopic: any) => (

                        indexFieldTopic == fieldsTopic.length - 1 ?
                            <div key={field.id} className="mt-3">
                                <div className="mb-5 w-1/3">
                                    <label
                                        htmlFor="title"
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Tiêu đề
                                    </label>
                                    <input
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.name`, {
                                            required: "Tên bài giảng không thể thiếu",
                                        })}
                                        type="text"
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.name?.message}
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
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.description`)}
                                        rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viết mô tả cho chủ đề..."></textarea>

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.description?.message}
                                    </p>
                                </div>

                                <div className="mb-5 w-1/2">
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
                                                formData.append(fieldName, file, `${indexChapter + 1}-${indexFieldTopic + 1}-${file.name}`);
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
                                    <p>{getValues().chapters?.indexChapter?.topics?.indexTopic?.link_video}</p>
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
                                        server={{
                                            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                                const formData = new FormData();
                                                formData.append(fieldName, file, `${indexChapter + 1}-${indexFieldTopic + 1}-${file.name}`);
                                                const data = { id_course: id_course }

                                                formData.append('data', JSON.stringify(data));

                                                const request = new XMLHttpRequest();
                                                request.open('POST', 'http://localhost:4001/api/v1/document')

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
                                    <p>{getValues().chapters?.indexChapter?.topics?.indexTopic?.link_video}</p>
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
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                            removeTopic(indexFieldTopic)
                                            setToggle({ ...toggle, [`add_lecture_${chapter.key}`]: false })

                                        }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                    <button type="submit"
                                        onClick={() => {
                                            setTypeSubmit(`add_lecture_${chapter.key}`)
                                        }}
                                        className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                </div>
                            </div>
                            : null
                    ))}

                </div>

                <div className={`${toggle[`add_exam_${chapter.key}`] ? "" : "hidden"} mt-3 pt-4 border-t-[1px] border-[#ececec]`}>
                    {fieldsTopic.map((field: any, indexFieldTopic: any) => (

                        indexFieldTopic == fieldsTopic.length - 1 ?
                            <div key={field.id} className="mt-3">
                                <div className="mb-5 w-1/3">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Tiêu đề
                                    </label>
                                    <input
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.title`, {
                                            required: "Tiêu đề không thể thiếu",
                                        })}
                                        type="text"
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.title?.message}
                                    </p>
                                </div>
                                <div className="mb-5 w-1/3">
                                    <label
                                        className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                    >
                                        Thời gian (phút)
                                    </label>
                                    <input
                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.duration`, {
                                            required: "Thời gian không thể thiếu",
                                        })}
                                        type="number"
                                        className={`bg-white border-[1px] border-[#ececec] text-[#343434] text-sm focus: ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                                    />

                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errors.chapters?.[indexChapter]?.topics?.[indexFieldTopic]?.duration?.message}
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
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                                        {...register(`chapters.${indexChapter}.topics.${indexFieldTopic}.status`)}
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
                                            removeTopic(indexFieldTopic)
                                            setToggle({ ...toggle, [`add_exam_${chapter.key}`]: false })

                                        }} type="button" className="mr-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Huỷ</button>
                                    <button type="submit"
                                        onClick={() => {
                                            setTypeSubmit(`add_exam_${chapter.key}`)
                                        }}
                                        className="focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-3">Lưu</button>
                                </div>
                            </div>
                            : null
                    ))}

                </div>





                <div className={`${toggle[`open_chapter_${chapter.key}`] ? "" : "hidden"} `}>

                    <DragDropContext onDragEnd={(result) => {
                        if (!result.destination) return;
                        const items: any = reorder(
                            topicsData,
                            result.source.index,
                            result.destination.index
                        );
                        setTopicsData(items)
                        setValue(`chapters.${indexChapter}.topics`, items)
                    }}>
                        <StrictModeDroppable droppableId="topic">
                            {(provided) => (
                                <ul  {...provided.droppableProps} ref={provided.innerRef}>
                                    {
                                        topicsData?.map((topic: any, indexTopic: any) => {
                                            return (

                                                <Draggable key={topic.key} index={indexTopic} draggableId={`${topic.key}`}>
                                                    {
                                                        (provided) => (
                                                            <TopicCard
                                                                chapter={chapter} topic={topic} indexChapter={indexChapter} indexTopic={indexTopic} hanldeForm={handleForm} innerRef={provided.innerRef} provided={provided} data={data} setData={setData}
                                                                removeTopic={removeTopic} fieldsTopic={fieldsTopic} setTypeSubmit={setTypeSubmit} id_course={id_course}
                                                            />
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
            </li>
        </div>

    )
}
