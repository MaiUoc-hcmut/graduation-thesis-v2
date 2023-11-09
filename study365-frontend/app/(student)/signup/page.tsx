'use client'
import React, { useEffect } from 'react';
import { signup, reset } from '@/redux/features/authSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { redirect } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function Signup() {
    const { isSuccess } = useAppSelector(state => state.authReducer);
    const dispatch = useDispatch<AppDispatch>();

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
            grade: 0,
        }
    })

    const handleRegisterSubmit: SubmitHandler<{
        name: string,
        email: string,
        password: string,
        confirmPassword: string,
        phone: string,
        address: string,
        gender: string,
        grade: number
    }> = async (data) => {
        if (data.password !== data.confirmPassword) {
            console.log(data.password)
            console.log(data.confirmPassword)
            dispatch(reset());
            redirect('/');
        } else {
            dispatch(signup(data));
        }
    };

    useEffect(() => {
        dispatch(reset());
        if (isSuccess) {
            redirect('/login');
        }
        dispatch(reset());
    });

    return (
        <div className="m-auto w-1/3 mt-10 mb-10 bg-slate-50 shadow-lg rounded-lg">
            <h3 className="py-5 text-center font-bold text-2xl">Đăng ký</h3>
            <form onSubmit={handleSubmit(handleRegisterSubmit)}>
                <div className="p-5">
                    <div className="">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                <p className='text-sm text-red-400'>*</p>Họ và tên
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="name"
                                        autoComplete="given-name"
                                        {...register('name', { required: "Your name is required" })}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.name?.message && (
                                        <p className='text-sm text-red-400'>{errors.name?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="email" className="block text-base text-sm font-medium leading-6 text-gray-900">
                                <p className='text-sm text-red-400'>*</p>Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        {...register('email', { required: "Email is required" })}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.email?.message && (
                                        <p className='text-sm text-red-400'>{errors.email?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="password" className="block text-base text-sm font-medium leading-6 text-gray-900">
                                <p className='text-sm text-red-400'>*</p>Mật khẩu
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        type="password"
                                        {...register('password', {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must contain at least 8 characters"
                                            }
                                        })}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.password?.message && (
                                        <p className='text-sm text-red-400'>{errors.password?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="confirmPassword" className="block text-base text-sm font-medium leading-6 text-gray-900">
                                    <p className='text-sm text-red-400'>*</p> Gõ lại mật khẩu
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        {...register('confirmPassword', {
                                            required: "Confirm password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must contain at least 8 characters"
                                            }
                                        })}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.password?.message && (
                                        <p className='text-sm text-red-400'>{errors.password?.message}</p>
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="phone" className="block text-base font-medium leading-6 text-gray-900">
                                    Số điện thoại
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="phone"
                                        {...register('phone', { required: "Phone number is required" })}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.phone?.message && (
                                        <p className='text-sm text-red-400'>{errors.phone?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="address" className="block text-base font-medium leading-6 text-gray-900">
                                    Địa chỉ
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="address"
                                        {...register('address', { required: "Address is required" })}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.address?.message && (
                                        <p className='text-sm text-red-400'>{errors.address?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="gender" className="block text-base font-medium leading-6 text-gray-900">
                                    Giới tính
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="gender"
                                        {...register('gender', { required: "Please choose your gender" })}
                                        value={0}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        defaultChecked
                                        defaultValue="Nam"
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                    {errors.gender?.message && (
                                        <p className='text-sm text-red-400'>{errors.gender?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="grade" className="block text-base font-medium leading-6 text-gray-900">
                                    Lớp
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="grade"
                                        {...register('grade', { required: "Please choose your grade" })}
                                        className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        defaultChecked
                                        defaultValue={10}
                                    >
                                        <option value={10}>Lớp 10</option>
                                        <option value={11}>Lớp 11</option>
                                        <option value={12}>Lớp 12</option>
                                    </select>
                                    {errors.grade?.message && (
                                        <p className='text-sm text-red-400'>{errors.grade?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-5 flex justify-center">
                    <button
                        type="submit"
                        className="rounded-md bg-btn_secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Đăng ký
                    </button>
                </div>
            </form>
        </div>
    )
}