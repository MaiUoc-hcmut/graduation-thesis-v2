import React, { useState, Fragment } from 'react';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ConfirmDelete from '../Modal/confirmDelete';
import EditDocument from '../Modal/editDocumentCard';
import { deleteDocument, reset } from '@/redux/features/documentSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

interface Document {
    id: number;
    title: string;
    lastUpdated: Date;
    created: Date;
    class: number;
    subject: string;
    level: string;
    url: string;
}

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
    const dispatch = useDispatch<AppDispatch>();
    const fileName = document.title.length > 20 ? `${document.title.substring(0, 17)}...` : document.title;
    const updateDay = new Date(document.lastUpdated);
    const createDay = new Date(document.created);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const deleteDoc = async () => {
        dispatch(reset());
        await dispatch(deleteDocument(document.id));
        setShowDeleteModal(false);
    }

    return (
        <Fragment>
            <div 
                className="block p-6 max-w-lg mx-auto rounded-xl shadow-md items-center"
                title={document.title}
            >
                <div className="flex justify-between items-center">
                    <a href={document.url} target='blank' className="title-xsm font-medium text-blue-700">{fileName}</a>
                    <div className="mt-2">
                        <a className="py-1 px-1" href={document.url} download={true}>
                            <DownloadRoundedIcon className='text-black' />
                        </a>
                        <button 
                            className="py-1 px-1"
                            onClick={() => setShowEditModal(true)}
                        >
                            <ModeEditOutlinedIcon className='text-black' />
                        </button>
                        
                        <button 
                            className="py-1 px-1"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <DeleteForeverRoundedIcon className='text-black' />
                        </button>
                    </div>
                </div>

                <p className="block text-gray-500">
                    Tạo ngày: {createDay.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh", hour12: false})}
                </p>
                <p className="block text-gray-500">
                    Cập nhật lần cuối: {updateDay.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh", hour12: false})}
                </p>

                <div className="flex text-black justify-between">
                    <p>Grade 10</p>
                    <p>Math</p>
                    <p>Advanced</p>
                </div>
            </div>
            <ConfirmDelete isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={deleteDoc} />
            <EditDocument isVisible={showEditModal} onClose={() => setShowEditModal(false)} document={document} />
        </Fragment>
    );
};

export default DocumentCard;
