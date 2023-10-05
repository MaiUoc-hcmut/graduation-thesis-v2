import React from "react";
import '@/styles/teacher/document/editModal.css';

interface Document {
    title: string;
    lastUpdated: string;
    class: string;
    subject: string;
    level: string;
    url: string;
}

interface ModalEditDocumentProps {
    isOpen: boolean;
    document: Document;
  }

const ModalEditDocument: React.FC<any> = () => {
    return (
        <div className='modal open'>
            Alo
        </div>
    )
}

export default ModalEditDocument;