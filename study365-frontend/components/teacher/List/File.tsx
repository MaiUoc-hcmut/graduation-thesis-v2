import React, { useEffect } from "react";
import { getDocumentBelongToFolder, reset } from '@/redux/features/documentSlice';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import DocumentCard from "../Card/document";

interface Props {
    currentFolderId: number
}

const DocumentList: React.FC<Props> = ({ currentFolderId }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { isGetSuccess, isGetFailed, message } = useAppSelector(state => state.documentReducer);
    const myDocument = useAppSelector(state => state.documentReducer.document);

    
    useEffect(() => {
        dispatch(getDocumentBelongToFolder(currentFolderId));
    }, [currentFolderId])

    useEffect(() => {
        dispatch(reset());
        if (isGetSuccess) {
            dispatch(reset());
        }
        if (isGetFailed) {
            dispatch(reset());
            console.log(message);
        }
    }, [dispatch, isGetSuccess, isGetFailed])


    const documentListRender = myDocument.map(doc => {
        const documentData = {
            id: doc.id,
            title: doc.name,
            lastUpdated: doc.updatedAt,
            created: doc.createdAt,
            class: doc.class,
            subject: doc.subject,
            level: doc.level,
            url: doc.url
        };
        return (
            <div 
                key={doc.id} 
                className=""
            >
                <DocumentCard document={documentData} />
            </div>
        )
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {documentListRender}
        </div>
    )
}

export default DocumentList;