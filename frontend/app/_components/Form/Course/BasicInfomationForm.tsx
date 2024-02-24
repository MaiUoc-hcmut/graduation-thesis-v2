import { useEffect, useState } from "react"
import { ReactQuillEditor } from "../../Editor/ReactQuillEditor";
import categoryApi from "@/app/api/category";
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
import courseApi from "@/app/api/courseApi";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';


// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

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


export function BasicInfomationForm({
    handleForm,
    images,
    setImages
}: any) {
    const [category, setCategory] = useState<Category>(initCategory)
    const [files, setFiles] = useState([])

    const {
        register,
        setValue,
        getValues,
        formState: { errors }
    } = handleForm


    useEffect(() => {
        async function fetchCategory() {
            await categoryApi.getAll().then((data: any) => setCategory(data))
        }
        fetchCategory()
    }, []);

    useEffect(() => {
        setFiles(images?.thumbnail ? images.thumbnail : [])
    }, []);

    console.log(images, getValues());


    return (
        <>
            <div className="mb-5 w-1/3">
                <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                >
                    Tiêu đề
                </label>
                <input
                    {...register("name", {
                        required: "Tiêu đề không thể trống."
                    })}
                    type="text"
                    id="name"
                    name="name"
                    className={`bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                />
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors?.name?.message}
                </p>
            </div>
            <div className="mb-5 w-1/3">
                <label
                    htmlFor="grade"
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                >
                    Lớp học
                </label>
                <select id="grade" name="grade" {...register("grade", {
                    required: "Lớp không thể trống"
                })} defaultValue={getValues().grade} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Chọn lớp học</option>

                    {category.Class?.map((cl, index) => {
                        return (
                            <option key={index} value={`${cl.id}`}>{cl.name}</option>
                        )
                    })}
                </select>
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
                <select {...register("subject", {
                    required: "Môn không thể trống"
                })} id="subject" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" defaultChecked>Chọn môn học</option>

                    {category.Subject?.map((subject, index) => {
                        return (
                            <option key={index} value={`${subject.id}`} >{subject.name}</option>
                        )
                    })}
                </select>
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
                <select  {...register("level", {
                    required: "Mức độ không thể trống"
                })}
                    id="level" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" defaultChecked>Chọn mức độ</option>

                    {category.Level?.map((level, index) => {
                        return (
                            <option key={index} value={`${level.id}`} >{level.name}</option>
                        )
                    })}
                </select>
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors?.level?.message}
                </p>
            </div>
            <div className="mb-5 w-1/3">
                <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                >
                    Giá (VNĐ)
                </label>
                <input
                    {...register("price", {
                        min: {
                            value: 0,
                            message: "Giá không phù hợp."
                        }
                    })}
                    type="number"
                    id="price"
                    name="price"
                    className={`${!errors?.price ? 'bg-white border border-gray-300 text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'} text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                />
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors?.price?.message}
                </p>
                <p className="mt-2 text-[12px] text-[#818894]">
                    Nếu khóa học miễn phí hãy để trống.
                </p>
            </div>

            <div className="mb-5 w-1/2">
                <label
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                    htmlFor="thumbnail"
                >
                    Ảnh đại diện
                </label>
                <input
                    {...register("thumbnail", {
                        required: "Ảnh đại diện không thể trống."
                    })}
                    defaultValue={""}
                    accept=".png, .jpg, .jpeg"
                    name="thumbnail"
                    className={`bg-white border border-gray-300 text-[#343434] block w-full mb-2 text-xs rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                    id="thumbnail"
                    type="file"
                />
                {/* <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    acceptedFileTypes={['image/*']}
                    allowMultiple={true}
                    server={{
                        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                            const formData = new FormData();
                            formData.append(fieldName, file, file.name);

                            const request = new XMLHttpRequest();
                            request.open('POST', 'http://localhost:4001/api/v1/images')



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
                    // onaddfile={(error, file) => {
                    //     setImages({ ...images, thumbnail: file.file })
                    // }}
                    name="image"
                    labelIdle='Kéo & thả hoặc <span class="filepond--label-action">Tìm kiếm</span>'
                /> */}

                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors?.thumbnail?.message}
                </p>
            </div>
            <div className="mb-5 w-1/2">
                <label
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                    htmlFor="cover"

                >
                    Ảnh nền
                </label>
                <input
                    accept=".png, .jpg, .jpeg"
                    {...register("cover", {
                        required: "Ảnh nền không thể trống."
                    })}
                    className={`bg-white border border-gray-300 text-[#343434] block w-full mb-2 text-xs rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                    id="cover"
                    type="file"
                />
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors?.cover?.message}
                </p>
            </div>
            {/* <div className="mb-16">
                <label
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                >
                    Mô tả
                </label>
                <ReactQuillEditor
                    setValue={setValue} field={"description"}
                />
                <p className="mt-12 text-sm text-red-600 dark:text-red-500">
                    {errors?.description?.message}
                </p>
            </div>
            <div className="mb-16">
                <label
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                >
                    Mục tiêu
                </label>
                <ReactQuillEditor setValue={setValue} field={"goal"} />
            </div>
            <div className="mb-16">
                <label
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                >
                    Đối tượng
                </label>
                <ReactQuillEditor setValue={setValue} field={"object"} />
            </div>
            <div className="mb-16">
                <label
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                >
                    Yêu cầu
                </label>
                <ReactQuillEditor setValue={setValue} field={"requirement"} />
            </div> */}
        </>
    )
}

