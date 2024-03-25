



'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { login, loginTeacher, reset } from '@/redux/features/authSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { redirect } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
// import { toastError, toastSuccess } from '@/utils/toast';

export default function Login() {
    const [tab, setTab] = useState("student")
    const [error, setError] = useState<any>()
    const { isSuccess, isFailed, message } = useAppSelector(state => state.authReducer);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const handleLoginSubmit: SubmitHandler<{ email: string, password: string }> = async (data) => {
        if (tab == "student")
            await dispatch(login(data))
        else
            await dispatch(loginTeacher(data))

    };

    useEffect(() => {
        dispatch(reset());
        if (isSuccess) {
            dispatch(reset());
            if (tab == "student")
                redirect('/')
            else
                redirect('/teacher/dashboard')
        }
        if (isFailed) {
            console.log(message);
            dispatch(reset());
            redirect('/login');
        }
    }, [dispatch, isSuccess]);



    return (
        <div className="container px-4 w-full mx-auto flex justify-center">
            <div className="flex flex-wrap mt-20 mb-16 w-[1000px] rounded-2xl border-[1px] border-[#ececec]">
                <div className="flex-grow-0 flex-shrink-0 basis-1/2 w-1/2">
                    <Image
                        src="/images/front_login.jpg"
                        width={540}
                        height={874}
                        alt="login"
                        className='w-full h-full rounded-tl-xl rounded-bl-xl overflow-hidden object-cover object-center'
                    />
                </div>
                <div className="flex-grow-0 flex-shrink-0 basis-1/2 w-1/2">
                    <div className="py-[75px] px-[45px]">
                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Đăng nhập
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit(handleLoginSubmit)}>
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
                                                    defaultChecked
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
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register('email', { required: "Email không thể trống" })}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="test@gmail.com"
                                    />
                                    {message?.message && (
                                        <p className='mt-2 text-sm text-red-400'>{errors.email?.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        {...register('password', { required: "Mật khẩu không thể trống" })}
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    {error?.message && (
                                        <p className='mt-2 text-sm text-red-400'>{errors.password?.message}</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end">
                                    <Link
                                        href="#"
                                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Quên mật khẩu
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white shadow-primary_btn_shadow bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Đăng nhập
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Bạn chưa có tài khoản?{" "}
                                    <Link
                                        href="/register"
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Đăng ký
                                    </Link>
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        // <div className="mt-10 flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        //     <div className="w-1/3 bg-slate-50 rounded-lg shadow-lg p-6 mx-auto">
        //         <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        //             <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        //                 Đăng nhập
        //             </h2>
        //         </div>

        //         <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        //             <form className="space-y-6" onSubmit={handleSubmit(handleLoginSubmit)}>
        //                 <div>
        //                     <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 focus:ring-1">
        //                         Email
        //                     </label>
        //                     <div className="mt-2">
        //                         <input
        //                             id="email"
        //                             type="email"
        //                             autoComplete="email"
        //                             {...register('email', { required: "Name is required" })}
        //                             className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
        //                         />
        //                         {errors.email?.message && (
        //                             <p className='text-sm text-red-400'>{errors.email?.message}</p>
        //                         )}
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <div className="flex items-center justify-between">
        //                         <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
        //                             Password
        //                         </label>
        //                         <div className="text-sm">
        //                             <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 text-primary">
        //                                 Quên mật khẩu?
        //                             </a>
        //                         </div>
        //                     </div>
        //                     <div className="mt-2">
        //                         <input
        //                             id="password"
        //                             type="password"
        //                             autoComplete="current-password"
        //                             {...register('password', { required: "Password is required" })}
        //                             className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        //                         />
        //                         {errors.password?.message && (
        //                             <p className='text-sm text-red-400'>{errors.password?.message}</p>
        //                         )}
        //                     </div>
        //                 </div>

        //                 <div>
        //                     <button
        //                         type="submit"
        //                         className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
        //                     >
        //                         Đăng nhập
        //                     </button>
        //                 </div>


        //             </form>

        //             <div>
        //                 <span
        //                 ><hr style={{
        //                     background: '#DDDDDD',
        //                     borderColor: '#DDDDDD',
        //                     height: '1px',
        //                     marginTop: '30px'
        //                 }}
        //                     /></span>
        //             </div>




        //             <div className="mt-8">
        //                 <button
        //                     className="flex w-full justify-center rounded-md ring-1 ring-[#B2BABB] px-3 py-1.5 text-sm font-semibold leading-6 text-[#828282] shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
        //                 >
        //                     <span className='mr-1'><Image
        //                         src="/logo-google.png"
        //                         width={25}
        //                         height={25}
        //                         alt="logo google"
        //                     /></span>
        //                     Tiếp tục với Google
        //                 </button>
        //                 <button
        //                     className="flex mt-3 w-full justify-center rounded-md ring-1 ring-[#B2BABB] bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-[#828282] shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
        //                 >
        //                     <span className='mr-2 mt-1'><Image
        //                         src="/logo-facebook.png"
        //                         width={16}
        //                         height={16}
        //                         alt="logo facebook"
        //                     /></span>
        //                     Tiếp tục với Facebook
        //                 </button>
        //             </div>

        //             <p className="mt-10 text-center text-sm text-gray-500">
        //                 Bạn chưa có tài khoản?{' '}
        //                 <a href="#" className="font-semibold leading-6 text-primary hover:text-indigo-500">
        //                     Đăng ký ngay
        //                 </a>
        //             </p>
        //         </div>
        //     </div>
        // </div>
    )
};
