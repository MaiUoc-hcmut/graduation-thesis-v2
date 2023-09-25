'use client'
import Image from 'next/image'
import React from 'react'

export default function Login() {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log("abcdef");
    }

    return (
        <div className="mt-10 flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
            <div className="w-1/3 bg-slate-50 rounded-lg shadow-lg p-6 mx-auto">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Đăng nhập
                    </h2>
                </div>

                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 focus:ring-1">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                />
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
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md text-[white] bg-btn_secondary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
}
