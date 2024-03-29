import { useState } from "react"
import { FormWrapper } from "./FormWrapper"
export function BasicInfomationForm({
    register,
    errors
}: any) {

    const [openForm, setOpenForm] = useState({})
    const [formData, setFormData] = useState([])
    const [formD, setFormD] = useState({})

    return (
        <FormWrapper title="">
            <div className="mb-5 w-1/3">
                <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                >
                    Tiêu đề
                </label>
                <input
                    {...register("title", {
                        required: "Tiêu đề không thể trống"
                    })}
                    type="text"
                    id="title"
                    className={`${!errors.title ? 'bg-white border border-gray-300 text-[#343434]' : 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700'} text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5`}
                />
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.title?.message}
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
                <select {...register("subject")} id="subject" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="toán" defaultChecked>Toán</option>
                    <option value="lý">Lý</option>
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
                    {...register("price")}
                    type="number"
                    id="price"
                    className="bg-white border border-gray-300 text-[#343434] text-sm focus:ring-blue-500 focus:border-blue-500 rounded-lg block w-full p-2.5"
                />
                <p className="mt-2 text-[12px] text-[#818894]">
                    Nếu khóa học miễn phí hãy để trống.
                </p>
            </div>
            <div className="mb-5 w-1/3">
                <label
                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347]"
                    htmlFor="thumbnail"
                >
                    Ảnh đại diện
                </label>
                <input
                    {...register("thumbnail")}
                    className="block w-full mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="thumbnail"
                    type="file"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
            </div>
        </FormWrapper >
    )
}

