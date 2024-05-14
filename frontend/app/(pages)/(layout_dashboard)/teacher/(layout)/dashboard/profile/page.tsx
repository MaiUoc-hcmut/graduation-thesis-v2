"use client"

import categoryApi from '@/app/api/category';
import userApi from '@/app/api/userApi';
import { useAppSelector } from '@/redux/store';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type user = {
    id: string,
    name: string,
    phone: string,
    email: string,
    subject: string

}

type password = {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string

}

const EditProfilePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState<any>()
    const [info, setInfo] = useState<any>()
    const [formMethods, setFormMethods] = useState<any>()

    const user = useAppSelector(state => state.authReducer.user);
    const {
        register: registerTeacher,
        handleSubmit: handleSubmitTeacher,
        formState: { errors: errorsTeacher },
        setValue: setValueTeacher,
    } = useForm<user>({
        defaultValues: info
    })
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<password>({
        defaultValues: {}
    })
    useEffect(() => {
        async function fetchData() {
            await categoryApi.getAll().then((data: any) => setCategory(data)).catch((err: any) => { })
            await userApi.getTeacherById(`${user.id}`).then((data: any) => {
                setInfo(data.data)
                Object.keys(data.data).forEach((key: any) => {
                    setValueTeacher(key, data.data[key]);
                });
            }).catch((err: any) => { })
        }
        fetchData()
    }, [setValueTeacher, user.id]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        // Call API to update profile with data
        // After updating, set isLoading to false
        setIsLoading(false);
    };

    return (
        <div className='w-1/3'>
            <form onSubmit={(handleSubmitTeacher(() => { }))} className="space-y-4 md:space-y-6" action="#">

                <div className="">
                    <div className="">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900 mb-2">Thông tin cá nhân</h2>
                        <div className="">
                            <div className="mb-5">
                                <label
                                    htmlFor="namet"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="namet"
                                    {...registerTeacher('name', { required: "Họ và tên không thể thiếu" })}
                                    className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {errorsTeacher?.name?.message && (
                                    <p className='mt-2 text-sm text-red-400'>{errorsTeacher.name?.message}</p>
                                )}
                            </div>
                            <div className="mb-5">
                                <>
                                    <label
                                        htmlFor="phone-input"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                            <svg
                                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 19 18"
                                            >
                                                <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="phone-input"
                                            aria-describedby="helper-text-explanation"
                                            className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                            {...registerTeacher('phone', { required: "Số diện thoại không thể thiếu" })}
                                        />
                                    </div>
                                </>

                                {errorsTeacher?.phone?.message && (
                                    <p className='mt-2 text-sm text-red-400'>{errorsTeacher.phone?.message}</p>
                                )}
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="subject"
                                    className="block mb-2 text-sm font-semibold text-[14px] text-[#171347] "
                                >
                                    Môn học
                                </label>
                                <select id="subject" defaultValue="" {...registerTeacher('subject', { required: "Môn học không thể thiếu" })} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="">Chọn môn học</option>

                                    {category?.Subject?.map((sb: any, index: number) => {
                                        return (
                                            <option key={index} value={`${sb.id}`}>{sb.name}</option>
                                        )
                                    })}
                                </select>
                                {errorsTeacher?.subject?.message && (
                                    <p className='mt-2 text-sm text-red-400'>{errorsTeacher.subject?.message}</p>
                                )}
                            </div>

                            <div className="mb-5">
                                <label
                                    htmlFor="emailt"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="emailt"
                                    {...registerTeacher('email', { required: "Email không thể thiếu" })}
                                    className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="test@gmail.com"
                                />
                                {errorsTeacher?.email?.message && (
                                    <p className='mt-2 text-sm text-red-400'>{errorsTeacher.email?.message}</p>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* <div className="">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Thông tin chuyên môn</h2>

                <div className="mt-5">


                    <div className="col-span-full">
                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                            Giới thiệu
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={''}
                            />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">Viết một vài dòng về bản thân.</p>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Bằng cấp
                        </label>
                        <div className="mt-2 flex justify-center rounded-base border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Chứng chỉ
                        </label>
                        <div className="mt-2 flex justify-center rounded-base border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
                </div>

                <div className="">
                    <button
                        type="submit"
                        className="w-1/2 mb-5 text-white bg-primary shadow-primary_btn_shadow hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Lưu thông tin
                    </button>
                </div>


            </form>
            <form onSubmit={(handleSubmit((data) => {
                const formData = {
                    data: { ...data }
                }
                userApi.changePasswordTeacher(formData)
                reset()
            }))} className="space-y-4 md:space-y-6 mt-5" action="#">

                <div className="">
                    <div className="">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900 mb-2">Mật khẩu</h2>
                        <div className="">
                            <div className="mb-5">
                                <label
                                    htmlFor="cpasswordt"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Mật khẩu cũ
                                </label>
                                <input
                                    type="password"
                                    {...register('oldPassword', { required: "Mât khẩu cũ không thể thiếu" })}
                                    id="confirm-passwordt"
                                    placeholder="••••••••"
                                    className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {errors?.oldPassword?.message && (
                                    <p className='mt-2 text-sm text-red-400'>{errors.oldPassword?.message}</p>
                                )}
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="passwordt"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    {...register('newPassword', { required: "Mật khẩu mới không thể thiếu" })}
                                    id="passwordt"
                                    placeholder="••••••••"
                                    className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {errors?.newPassword?.message && (
                                    <p className='mt-2 text-sm text-red-400'>{errors.newPassword?.message}</p>
                                )}
                            </div>

                            <div className="mb-5">
                                <label
                                    htmlFor="confirm-passwordt"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="confirm-password"
                                    {...register('confirmPassword', { required: "Xác nhận lại mật khẩu không thể thiếu" })}
                                    id="confirm-passwordt"
                                    placeholder="••••••••"
                                    className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                {errors?.confirmPassword?.message && (
                                    <p className='mt-2 text-sm text-red-400'>{errors.confirmPassword?.message}</p>
                                )}
                            </div>

                        </div>
                    </div>

                </div>

                <div className="">
                    <button
                        type="submit"
                        className="w-1/2 mb-5 text-white bg-primary shadow-primary_btn_shadow hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Đổi mật khẩu
                    </button>
                </div>


            </form>
        </div>
    );
};

export default EditProfilePage;