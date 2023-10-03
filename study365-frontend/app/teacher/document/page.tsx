'use client'
import React, { useEffect } from "react";
import DocumentCard from "@/components/teacher/Card/document";
import { getDocumentCreatedByTeacher, reset } from '@/redux/features/documentSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';

const Document = () => {

    const documentData = {
        title: 'hkahkfhkahsjfhkafhkhkshfksa',
        lastUpdated: '2023-10-01',
        class: 'Math',
        subject: 'Algebra',
        level: 'Advanced',
        url: 'www.example.com/my-document.pdf'
    };

    const teacherId = useAppSelector(state => state.authReducer.user.uid);
    
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
            <div key={doc.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <DocumentCard document={documentData} />
            </div>
        )
    })

    return (
        <div className="flex flex-wrap justify-center">
            {/* <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <DocumentCard document={documentData} />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <DocumentCard document={documentData} />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <DocumentCard document={documentData} />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <DocumentCard document={documentData} />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <DocumentCard document={documentData} />
            </div> */}
            {documentList}
        </div>
    )
}

export default Document;