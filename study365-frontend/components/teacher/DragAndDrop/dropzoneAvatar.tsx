'use client'
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import axios from 'axios';

interface Document {
    id: number;
    title: string;
    lastUpdated: Date;
    class: number;
    subject: string;
    level: string;
    url: string;
}

type Props = {
    setAvatar: React.Dispatch<React.SetStateAction<null |File>>;
    existedFile?: boolean;
}

const DropzoneAvatar: React.FC<Props> = ({ setAvatar, existedFile = false }) => {
    const [isDrop, setIsDrop] = useState(existedFile);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        setIsDrop(true);
        setAvatar(acceptedFiles[0]);
        const file = new FileReader;
        file.onload = () => {
            setPreview(file.result);
        }
        file.readAsDataURL(acceptedFiles[0])
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div 
                className="mt-2 flex justify-center items-center rounded-base 
                    border border-dashed border-blue-500 w-100
                    h-100 cursor-pointer"
                {...getRootProps()}
            >
                <div className="text-center">
                    <input {...getInputProps()} />
                    {
                        preview ? (
                            <img
                                src={preview as string}
                                alt='preview avatar'
                            />
                        ) : (isDragActive ? (
                            <p>Thả ảnh ở đây ...</p>
                        ) : (
                            <div>
                                <p>Kéo và thả ảnh ở đây</p>
                                <p>Hoặc nhấn vào đây để chọn ảnh muốn tạo</p>
                            </div>
                        ))
                    }
                    
                </div>
            </div>
        </div>
    )
};

export default DropzoneAvatar;
