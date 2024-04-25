"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { signup, reset } from '@/redux/features/authSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
    const [tab, setTab] = useState("student")
    const { isSuccess } = useAppSelector(state => state.authReducer);
    const dispatch = useDispatch<AppDispatch>();

    const handleRegisterSubmit = async (data: any) => {
        dispatch(signup(data));
    };

    useEffect(() => {
        dispatch(reset());
        if (isSuccess) {
            redirect('/login');
        }
        dispatch(reset());
    });
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
            gender: '',
            grade: 10,
        }
    })
    return (
        <div className="container px-4 w-full mx-auto flex justify-center">
            <div className="flex flex-wrap mt-20 mb-16 w-[1000px] rounded-2xl border-[1px] border-[#ececec]">
                {/* <div className="flex-grow-0 flex-shrink-0 basis-1/2 w-1/2">
                    <Image
                        src="/images/front_login.jpg"
                        width={540}
                        height={874}
                        alt="login"
                        className='w-full h-full rounded-tl-xl rounded-bl-xl overflow-hidden object-cover object-center'
                    />
                </div> */}
                <div className="w-full">
                    <div className="py-[75px] px-[45px]">
                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Đăng ký
                            </h1>
                            <form onSubmit={(handleSubmit(handleRegisterSubmit))} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                                        Loại tài khoản
                                    </label>
                                    <ul style={{
                                        marginTop: "10px"
                                    }} className="tems-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input
                                                    id="horizontal-list-radio-license"
                                                    type="radio"
                                                    defaultValue=""
                                                    name="list-radio"
                                                    onClick={() => setTab("student")
                                                    }
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                />
                                                <label
                                                    htmlFor="horizontal-list-radio-license"
                                                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Học sinh
                                                </label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                            <div className="flex items-center ps-3">
                                                <input
                                                    id="horizontal-list-radio-id"
                                                    type="radio"
                                                    defaultValue=""
                                                    name="list-radio"
                                                    onClick={() => setTab("teacher")
                                                    }
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                />
                                                <label
                                                    htmlFor="horizontal-list-radio-id"
                                                    className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Giáo viên
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className={`${tab === "student" ? "" : "hidden"} `}>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            {...register('email', { required: "Your name is required" })}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="test@gmail.com"
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            {...register('password', { required: "Your name is required" })}
                                            id="password"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="confirm-password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Xác nhận mật khẩu
                                        </label>
                                        <input
                                            type="confirm-password"
                                            {...register('confirmPassword', { required: "Your name is required" })}
                                            id="confirm-password"
                                            placeholder="••••••••"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={`${tab === "teacher" ? "" : "hidden"} `}>
                                    <div className="flex">
                                        <div className="w-1/2 mr-5">
                                            <h2 className="text-lg font-semibold leading-7 text-gray-900">Thông tin cá nhân</h2>
                                            <div className="">
                                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                                    <div className="sm:col-span-5">
                                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                            Họ và tên
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                autoComplete="given-name"
                                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-5">
                                                        <label htmlFor="email" className="block text-base  font-medium leading-6 text-gray-900">
                                                            Email
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                autoComplete="email"
                                                                className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-5">
                                                        <label htmlFor="password" className="block text-base  font-medium leading-6 text-gray-900">
                                                            Password
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="password"
                                                                name="password"
                                                                type="password"
                                                                autoComplete="password"
                                                                className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                    <div className="sm:col-span-5">
                                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                            Số điện thoại
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                autoComplete="given-name"
                                                                className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-5">
                                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                            Địa chỉ
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                autoComplete="given-name"
                                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="country" className="block text-base font-medium leading-6 text-gray-900">
                                                            Giới tính
                                                        </label>
                                                        <div className="mt-2">
                                                            <select
                                                                id="country"
                                                                name="country"
                                                                autoComplete="country-name"
                                                                className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                            >
                                                                <option>Nam</option>
                                                                <option>Nữ</option>
                                                                <option>Khác</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold leading-7 text-gray-900">Thông tin chuyên môn</h2>

                                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="country" className="block text-base font-medium leading-6 text-gray-900">
                                                        Lớp
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            id="country"
                                                            name="country"
                                                            autoComplete="country-name"
                                                            className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                        >
                                                            <option>Lớp 10</option>
                                                            <option>Lớp 11</option>
                                                            <option>Lớp 12</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="country" className="block text-base font-medium leading-6 text-gray-900">
                                                        Môn học
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            id="country"
                                                            name="country"
                                                            autoComplete="country-name"
                                                            className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                        >
                                                            <option>Toán</option>
                                                            <option>Lý</option>
                                                            <option>Hóa</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="password" className="block text-base font-medium leading-6 text-gray-900">
                                                        Cấp bậc
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            autoComplete="password"
                                                            className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

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
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            aria-describedby="terms"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="terms"
                                            className="font-light text-gray-500 dark:text-gray-300"
                                        >
                                            Tôi đồng ý với
                                            <Link
                                                className="ml-1 font-medium text-primary-600 hover:underline dark:text-primary-500"
                                                href="#"
                                            >
                                                Chính sách và điểu kiện
                                            </Link>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-primary shadow-primary_btn_shadow hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Tạo tài khoản
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Bạn đã có tài khoản?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Đăng nhập tại đây
                                    </Link>
                                </p>


                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

