'use client'
import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
// import { updateDocument, reset } from "@/redux/features/documentSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { createFolder, reset } from "@/redux/features/folderSlice";
import '@/styles/teacher/document/editModal.css';

interface ModalEditDocumentProps {
    isVisible: boolean;
    onClose: () => void;
    folderId?: number;
}

const NewFolder: React.FC<ModalEditDocumentProps> = ({ isVisible, onClose, folderId }) => {
    if (!isVisible) return null

    const dispatch = useDispatch<AppDispatch>();

    const { isCreateFailed, isCreateSuccess, message } = useAppSelector(state => state.folderReducer);

    const handleClose = (e: any) => {
        if (e.target.id === 'wrapper') onClose(); 
    }

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            folderName: new Date().toLocaleString()
        }
    })

    const handleCreateFolderSubmit: SubmitHandler<{
        folderName: string
    }> = async (data) => {
        const formData = {
            name: data.folderName,
            parentId: -1
        }
        if (folderId !== undefined) {
            formData.parentId = folderId
        } 
        dispatch(reset());
        dispatch(createFolder(formData));
        dispatch(reset());
        onClose();
    }

    useEffect(() => {
        if (isCreateSuccess) {
            
        }
        if (isCreateFailed) console.log(message)
        dispatch(reset());
    }, [dispatch, isCreateSuccess, isCreateFailed]);

    return (
        <div 
            className="
                fixed inset-0 bg-black bg-opacity-25 
                backdrop-blur-sm flex justify-center items-center"
            id="wrapper"
            onClick={handleClose}
        >
            <div className="w-[400px]">
                <div className="bg-white p-4 rounded-lg">
                    <form onSubmit={handleSubmit(handleCreateFolderSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="folderName" className="self-start">
                                <p className="text-black text-2xl">Thư mục mới</p>
                            </label>
                        </div>
                        <div className="flex justify-center">
                            <input 
                                id="folderName"
                                type="text" 
                                placeholder="Tên thư mục" 
                                className="
                                    block mx-auto px-4 py-2 border-2 
                                    border-blue-400 focus:border-blue-600 
                                    rounded-lg focus:outline-none focus:ring-0"
                                {...register('folderName', { required: "Name of folder is reuired"})}
                            />
                            {errors.folderName?.message && (
                                <p className='text-sm text-red-400'>{errors.folderName?.message}</p>
                            )}
                        </div>
                        <div className="flex justify-center mt-5">
                            <button 
                                type="button" 
                                className="focus:outline-none text-blue-500 focus:ring-2
                                    font-medium rounded-xl text-sm px-5 py-2.5 border hover:bg-gray
                                    bg-transparent border-blue-500 font-bold w-20 mr-2"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button 
                                type="submit" 
                                className="focus:outline-none text-white focus:ring-2
                                    font-medium rounded-xl text-sm px-5 py-2.5 dark:bg-blue-500 
                                    dark:hover:bg-blue-700 font-bold w-20 ml-2"
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewFolder;