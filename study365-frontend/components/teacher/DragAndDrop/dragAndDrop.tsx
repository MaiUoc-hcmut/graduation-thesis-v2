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
    setFileDocument: React.Dispatch<React.SetStateAction<null |File>>;
    existedFile?: boolean;
}

const Dropzone: React.FC<Props> = ({ setFileDocument, existedFile = false }) => {
    const [isDrop, setIsDrop] = useState(existedFile);
    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        setIsDrop(true);
        setFileDocument(acceptedFiles[0]);
        console.log(acceptedFiles);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


    const handleRemoveFile = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDrop(false);
    }
    
    return (
        <div className="col-span-full">
            <label htmlFor="document-file" className="block text-sm font-medium leading-6 text-gray-900">
                Các file tài liệu
            </label>
            <div 
                className="mt-2 flex justify-center rounded-base 
                    border border-dashed border-blue-500 px-6 
                    py-10 cursor-pointer"
                {...getRootProps()}
            >
                <div className="text-center">
                    <input {...getInputProps()} />
                    {isDrop ? (
                        <div style={{ position: 'relative' }}>
                        <Image 
                            src='/pdf_preview.png' 
                            alt="Preview"
                            width={60}
                            height={90}
                        />
                        <div
                            onClick={handleRemoveFile}
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '5px',
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '50%',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                X
                            </span>
                        </div>
                    </div>
                    ) : (
                        isDragActive ? (
                            <p>Thả tệp ở đây ...</p>
                        ) : (
                            <p>Kéo và thả tệp ở đây, hoặc nhấn vào đây để chọn tệp muốn tạo</p>
                        )
                    )}
                    {!isDrop && <p className="text-xs leading-5 text-gray-600">PDF, doc, docx allowed</p>}
                </div>
            </div>
        </div>
    )
};

export default Dropzone;
