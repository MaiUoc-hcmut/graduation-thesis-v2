'use client'
import React, { useState } from "react";
import Dropzone from "../DragAndDrop/dragAndDrop";
import { SubmitHandler, useForm } from 'react-hook-form';
import { uploadFile, createDocument, reset } from "@/redux/features/documentSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";

type Props = {
    isVisible: boolean,
    onClose: () => void
}

const CreateDocumentModal: React.FC<Props> = ({ isVisible, onClose }) => {
    if (!isVisible) return null

    const [fileDocument, setFileDocument] = useState<null | File>(null);
    const dispatch = useDispatch<AppDispatch>();

    const { isSuccess, isFailed, url, message } = useAppSelector(state => state.documentReducer);

    const handleClose = (e: any) => {
        if (e.target.id === 'wrapper') onClose(); 
    }

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        defaultValues: {
            class: 0,
            level: '',
            subject: '',
        }
    })

    const handleCreateSubmit: SubmitHandler<{
        class: number,
        level: string,
        subject: string,
    }> = async (data) => {
        if (fileDocument) {
            dispatch(reset());
            await dispatch(uploadFile(fileDocument));
            if (isSuccess) {
                const formData = {
                    categories: {
                        class: data.class,
                        level: data.level,
                        subject: data.subject,
                    },
                    name: "abcd",
                    url
                }
                dispatch(reset());
                dispatch(createDocument(formData));
            }
            dispatch(reset());
            if (isFailed) console.log(message)
            onClose();
        }
    }

    return (
        <div 
            className="
                fixed inset-0 bg-black bg-opacity-25 
                backdrop-blur-sm flex justify-center items-center"
            id="wrapper"
            onClick={handleClose}
        >
            <div className="w-[600px]">
                <div className="bg-white p-4 rounded">
                    <form onSubmit={handleSubmit(handleCreateSubmit)}>
                        <div className="flex flex-row justify-between items-center mt-4 mb-5 pr-5">
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
                                    {...register('class', {
                                        required: 'Class is required'
                                    })}
                                >
                                    <option value={0}>Chọn lớp</option>
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
                                    {...register('subject', {
                                        required: 'Subject is required'
                                    })}
                                >
                                    <option value="">Chọn môn học</option>
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
                                    {...register('level', {
                                        required: 'Level is required'
                                    })}
                                >
                                    <option value="">Chọn mức độ</option>
                                    <option value="advanced">Nâng cao</option>
                                </select>
                            </div>
                        </div>
                        <Dropzone setFileDocument={setFileDocument} />
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
                                Tạo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateDocumentModal;