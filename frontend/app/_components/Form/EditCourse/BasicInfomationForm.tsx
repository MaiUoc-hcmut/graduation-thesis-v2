import { useEffect, useState } from "react"
import { ReactQuillEditor } from "../../Editor/ReactQuillEditor";
import categoryApi from "@/app/api/category";
import UploadFile from "@/app/_components/UploadFile"
export function BasicInfomationForm({
    handleForm
}: any) {

    const {
        register,
        setValue,
        formState: { errors }
    } = handleForm
    console.log(errors);

    useEffect(() => {
        async function fetchCategory() {
            const category = await categoryApi.getAll()
            return category
        }
        console.log(fetchCategory(), 111);

    }, []);

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
                    className={`${!errors?.name ? 'bg-white border border-gray-300 text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'} text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
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
                <select id="grade" {...register("grade")} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="10" defaultChecked>10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
            </div>
            <div className="mb-5 w-1/3">
                <label
                    htmlFor="subject"
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                >
                    Môn học
                </label>
                <select  {...register("subject")} id="subject" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="toán" defaultChecked>Toán</option>
                    <option value="lý">Lý</option>
                </select>
            </div>
            <div className="mb-5 w-1/3">
                <label
                    htmlFor="level"
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                >
                    Mức độ
                </label>
                <select  {...register("level")} id="level" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="cơ bản" defaultChecked>Cơ bản</option>
                    <option value="nâng cao">Nâng cao</option>
                </select>
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
                    accept=".png, .jpg, .jpeg"
                    name="thumbnail"
                    className={`${!errors?.thumbnail ? 'bg-white border border-gray-300 text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'}block w-full mb-2 text-xs rounded-lg cursor-pointe dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                    id="thumbnail"
                    type="file"
                />
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors?.thumbnail?.message}
                </p>
                {/* <UploadFile /> */}
            </div>
            <div className="mb-5 w-1/3">
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
                    className={`${!errors?.cover ? 'bg-white border border-gray-300 text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'}block w-full mb-2 text-xs rounded-lg cursor-pointe dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                    id="cover"
                    type="file"
                />
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors?.cover?.message}
                </p>
            </div>
            <div className="mb-16">
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
            </div>
        </>
    )
}

