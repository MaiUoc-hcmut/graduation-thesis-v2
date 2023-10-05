'use client'
import React, { useEffect } from "react";
import DocumentCard from "@/components/teacher/Card/document";
import { getDocumentCreatedByTeacher, reset } from '@/redux/features/documentSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import Link from "next/link";
import { redirect } from "next/navigation";

const Document = () => {

    const documentData = {
        title: 'hkahkfhkahsjfhkafhkhkshfksa',
        lastUpdated: '2023-10-01',
        class: 'Math',
        subject: 'Algebra',
        level: 'Advanced',
        url: 'www.example.com/my-document.pdf'
    };

    const { isAuthTeacher } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        if (!isAuthTeacher) {
            redirect('/teacher/login');
        }
    }, [isAuthTeacher, redirect]);

    const teacherId = useAppSelector(state => state.authReducer.user.id);
    // let documentList = [];

    const dispatch = useDispatch<AppDispatch>();
    const { isSuccess, isFailed, message, isInit, document } = useAppSelector(state => state.documentReducer);

    useEffect(() => {
        if (isInit) {
            dispatch(getDocumentCreatedByTeacher(teacherId));
        }
    }, [isInit])

    useEffect(() => {
        if (isSuccess) {
            console.log(document)
        }
        if (isFailed) {
            console.log(message);
        }
    }, [dispatch, isSuccess, isFailed])

    const documentList = document.map(doc => {
        return (
            <div 
                key={doc.id} 
                className="
                    w-full flex flex-row p-4 bg-white 
                    border border-gray-200 rounded-lg 
                    shadow dark:bg-gray-800 dark:border-gray-700"
            >
                <DocumentCard document={documentData} />
            </div>
        )
    })

    return (
        <div>
            <div className="py-5 pr-5 flex flex-row justify-between items-center">
                <h3 className="font-medium text-2xl py-2 px-5">Quản lý tài liệu</h3>
                <Link href='course/create'>
                    <button 
                        type="button" 
                        className="focus:outline-none text-white bg-green-700 
                            hover:bg-green-800 focus:ring-4 focus:ring-green-300 
                            font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 
                            dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >Tạo tài liệu
                    </button>
                </Link>
            </div>
            <div className="flex flex-row justify-between items-center mt-4 pr-5">
                <form className="flex items-center flex-1">
                    <select id="countries" className="bg-gray-50 mx-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Chọn lớp</option>
                        <option value="toán">Toán</option>
                    </select>
                    <select id="countries" className="bg-gray-50 mx-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Chọn môn học</option>
                        <option value="toán">Toán</option>
                    </select>
                    <select id="countries" className="bg-gray-50 mx-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Chọn mức độ</option>
                        <option value="toán">Toán</option>
                    </select>

                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="w-full">
                        <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm khóa học..." />
                    </div>
                    <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </form>
            </div>
            <div className="grid grid-cols-2 gap-6 p-5 mt-10">
                {documentList}
            </div>
        </div>
    )
}

export default Document;