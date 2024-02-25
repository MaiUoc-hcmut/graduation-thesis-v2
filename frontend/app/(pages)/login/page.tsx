// "use client"

// import Link from "next/link"
// import Image from "next/image"
// export default function LoginPage() {

//     return (
//         <div className="container px-4 w-full mx-auto flex justify-center">
//             <div className="flex flex-wrap mt-[160px] mb-16 w-[1000px] rounded-2xl border-[1px] border-[#ececec]">
//                 <div className="flex-grow-0 flex-shrink-0 basis-1/2 w-1/2">
//                     <Image
//                         src="/images/front_login.jpg"
//                         width={540}
//                         height={874}
//                         alt="login"
//                         className='w-full h-full rounded-tl-xl rounded-bl-xl overflow-hidden object-cover object-center'
//                     />
//                 </div>
//                 <div className="flex-grow-0 flex-shrink-0 basis-1/2 w-1/2">
//                     <div className="py-[75px] px-[45px]">
//                         <div className="space-y-4 md:space-y-6">
//                             <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                                 Đăng nhập
//                             </h1>
//                             <form className="space-y-4 md:space-y-6" action="#">
//                                 <div>
//                                     <label
//                                         htmlFor="email"
//                                         className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                                     >
//                                         Email
//                                     </label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         id="email"
//                                         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         placeholder="name@company.com"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label
//                                         htmlFor="password"
//                                         className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                                     >
//                                         Mật khẩu
//                                     </label>
//                                     <input
//                                         type="password"
//                                         name="password"
//                                         id="password"
//                                         placeholder="••••••••"
//                                         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-start">
//                                         <div className="flex items-center h-5">
//                                             <input
//                                                 id="remember"
//                                                 aria-describedby="remember"
//                                                 type="checkbox"
//                                                 className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="ml-3 text-sm">
//                                             <label
//                                                 htmlFor="remember"
//                                                 className="text-gray-500 dark:text-gray-300"
//                                             >
//                                                 Ghi nhớ
//                                             </label>
//                                         </div>
//                                     </div>
//                                     <Link
//                                         href="#"
//                                         className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
//                                     >
//                                         Quên mật khẩu
//                                     </Link>
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     className="w-full text-white shadow-primary_btn_shadow bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//                                 >
//                                     Đăng nhập
//                                 </button>
//                                 <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//                                     Bạn chưa có tài khoản?{" "}
//                                     <Link
//                                         href="/register"
//                                         className="font-medium text-primary-600 hover:underline dark:text-primary-500"
//                                     >
//                                         Đăng ký
//                                     </Link>
//                                 </p>
//                             </form>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }



'use client'
import Image from 'next/image';
import React, { useEffect } from 'react';
import { login, loginTeacher, reset } from '@/redux/features/authSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { redirect } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { toastError, toastSuccess } from '@/utils/toast';

export default function Login() {

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
        await dispatch(login(data));
    };

    useEffect(() => {
        dispatch(reset());
        if (isSuccess) {
            // toastSuccess("Login success");
            dispatch(reset());
            redirect('/course');
        }
        if (isFailed) {
            // toastError(message);
            dispatch(reset());
        }
    }, [dispatch, isSuccess]);

    return (
        <div className="mt-10 flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
            <div className="w-1/3 bg-slate-50 rounded-lg shadow-lg p-6 mx-auto">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Đăng nhập
                    </h2>
                </div>

                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(handleLoginSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 focus:ring-1">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email', { required: "Name is required" })}
                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                />
                                {errors.email?.message && (
                                    <p className='text-sm text-red-400'>{errors.email?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 text-primary">
                                        Quên mật khẩu?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...register('password', { required: "Password is required" })}
                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                />
                                {errors.password?.message && (
                                    <p className='text-sm text-red-400'>{errors.password?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
                            >
                                Đăng nhập
                            </button>
                        </div>


                    </form>

                    <div>
                        <span
                        ><hr style={{
                            background: '#DDDDDD',
                            borderColor: '#DDDDDD',
                            height: '1px',
                            marginTop: '30px'
                        }}
                            /></span>
                    </div>




                    <div className="mt-8">
                        <button
                            className="flex w-full justify-center rounded-md ring-1 ring-[#B2BABB] px-3 py-1.5 text-sm font-semibold leading-6 text-[#828282] shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
                        >
                            <span className='mr-1'><Image
                                src="/logo-google.png"
                                width={25}
                                height={25}
                                alt="logo google"
                            /></span>
                            Tiếp tục với Google
                        </button>
                        <button
                            className="flex mt-3 w-full justify-center rounded-md ring-1 ring-[#B2BABB] bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-[#828282] shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
                        >
                            <span className='mr-2 mt-1'><Image
                                src="/logo-facebook.png"
                                width={16}
                                height={16}
                                alt="logo facebook"
                            /></span>
                            Tiếp tục với Facebook
                        </button>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Bạn chưa có tài khoản?{' '}
                        <a href="#" className="font-semibold leading-6 text-primary hover:text-indigo-500">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
};
