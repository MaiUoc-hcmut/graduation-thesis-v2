"use client"

import Image from "next/image"
import Link from "next/link"
export default function RegisterPage() {

    return (
        <div className="container px-4 w-full mx-auto flex justify-center">
            <div className="flex flex-wrap mt-28 mb-16 w-[1000px] rounded-2xl border-[1px] border-[#ececec]">
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
                                Đăng ký
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
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
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required
                                    />
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
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirm-password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type="confirm-password"
                                        name="confirm-password"
                                        id="confirm-password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
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

