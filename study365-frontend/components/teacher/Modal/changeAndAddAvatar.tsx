'use client'
import React, { useEffect, useState } from "react";
import { uploadAvatar, reset } from "@/redux/features/studentSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import DropzoneAvatar from "../DragAndDrop/dropzoneAvatar";

type Props = {
    isVisible: boolean,
    onClose: () => void,
}

const ChangeAndAddAvatar: React.FC<Props> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    const [avatar, setAvatar] = useState<null | File>(null);
    // const [preview, setPreview]

    const { id } = useAppSelector(state => state.authReducer.user);

    const dispatch = useDispatch<AppDispatch>();

    const handleClose = (e: any) => {
        if (e.target.id === 'wrapper') onClose(); 
    }

    const handleChangeAvatar = async () => {
        if (avatar) {
            const data = {
                file: avatar,
                id
            }
            dispatch(reset());
            await dispatch(uploadAvatar(data));
            dispatch(reset());
        }
        onClose();
    }

    useEffect(() => {
        dispatch(reset())
    }, [dispatch])

    return (
        <div
            className="
                fixed inset-0 bg-black bg-opacity-25 
                backdrop-blur-sm flex justify-center items-center"
            id="wrapper"
            onClick={handleClose}
        >
            <div className="w-[700px]">
                <div className="bg-white p-4 rounded">
                    <div className="flex flex-row justify-center items-center mt-4 mb-5">
                        <p className="font-bold text-3xl">Ảnh Đại Diện</p>
                    </div>
                    <DropzoneAvatar setAvatar={setAvatar} />
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
                            type="button" 
                            className="focus:outline-none text-white focus:ring-2
                                font-medium rounded-xl text-sm px-5 py-2.5 dark:bg-blue-500 
                                dark:hover:bg-blue-700 font-bold w-20 ml-2"
                            onClick={handleChangeAvatar}
                        >
                            Tạo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeAndAddAvatar;