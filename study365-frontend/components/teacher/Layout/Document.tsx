'use client'
import React, { useEffect, useState, Fragment, useRef } from "react";
import { useAppSelector } from '@/redux/store';
import { redirect, useParams } from "next/navigation";
import CreateDocumentModal from "@/components/teacher/Modal/createDocument";
import NewFolder from "@/components/teacher/Modal/newFolder";
// import DocumentList from "@/components/teacher/List/File";

export default function DocumentLayout({ 
    children 
}: { 
    children: React.ReactNode
}){

    const params = useParams();
    const id = params.id;
    let folderId = -1;
    if (id !== undefined) folderId = +id;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCreateFolder, setShowCreateFolder] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const node = useRef<HTMLDivElement>(null);

    const { isAuthTeacher } = useAppSelector(state => state.authReducer);

    useEffect(() => {
        if (!isAuthTeacher) {
            redirect('/teacher/login');
        }
    }, [isAuthTeacher, redirect]);

    const handleClickOutside = (e: MouseEvent) => {
        if (node.current && node.current.contains(e.target as Node)) {
            // inside click
            return;
        }
        // outside click 
        setIsMenuOpen(false);
    };

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClickOutside);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <Fragment>
            <div>
                <div className="py-5 pr-5 flex flex-row justify-between items-center relative" ref={node}>
                    <h3 className="font-medium text-2xl py-2 px-5">Quản lý tài liệu</h3>
                    <div>
                        <button 
                            type="button" 
                            className="focus:outline-none text-white bg-green-700 
                                hover:bg-green-800 focus:ring-4 focus:ring-green-300 
                                font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 
                                dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >Tạo mới
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <div 
                                        className="block px-4 py-2 text-sm hover:bg-blue-300 cursor-pointer" 
                                        role="menuitem"
                                        onClick={() => setShowCreateFolder(true)}
                                    >
                                        <p className="text-black">Thư mục mới</p>
                                    </div>
                                    <div 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 hover:text-gray-900 cursor-pointer" 
                                        role="menuitem"
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        <p className="text-black">Tải tệp lên</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center mt-4 pr-5">
                    <div className="flex items-center w-full">
                        <select 
                            id="class" 
                            className="
                                bg-gray-50 mx-5 border border-gray-300 
                                text-gray-900 text-sm rounded-lg 
                                focus:ring-blue-500 focus:border-blue-500 
                                block w-1/2 p-2.5 dark:bg-gray-700 
                                dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 
                                dark:focus:border-blue-500"
                        >
                            <option selected>Chọn lớp</option>
                            <option value={10}>Lớp 10</option>
                        </select>
                        <select 
                            id="subject" 
                            className="
                                bg-gray-50 mx-5 border border-gray-300 
                                text-gray-900 text-sm rounded-lg 
                                focus:ring-blue-500 focus:border-blue-500 
                                block w-1/2 p-2.5 dark:bg-gray-700 
                                dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 
                                dark:focus:border-blue-500"
                            >
                            <option selected>Chọn môn học</option>
                            <option value="math">Toán</option>
                        </select>
                        <select 
                            id="level" 
                            className="
                            bg-gray-50 mx-5 border border-gray-300 
                            text-gray-900 text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 
                            block w-1/2 p-2.5 dark:bg-gray-700 
                            dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 
                            dark:focus:border-blue-500"
                        >
                            <option selected>Chọn mức độ</option>
                            <option value="advanced">Nâng cao</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center mt-4 pr-5">
                    <form className="flex items-center flex-1">
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

                {children}
                
                <CreateDocumentModal 
                    isVisible={showCreateModal} 
                    parentId={folderId}
                    onClose={() => setShowCreateModal(false)} 
                />
                <NewFolder 
                    isVisible={showCreateFolder}
                    onClose={() => setShowCreateFolder(false)}
                    folderId={folderId}
                />
            </div>
        </Fragment>
    )
}