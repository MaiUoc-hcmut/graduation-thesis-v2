'use client'
import React, { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from 'antd';
import ConfirmDelete from "../Modal/confirmDelete";
import EditFolder from "../Modal/editFolder";
import ContextMenuFolder from "../ContextMenu/folder";
import { deleteFolder, reset } from "@/redux/features/folderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setSelectedFolder } from '@/redux/features/folderSlice';

interface Props {
    folderName: string,
    folderId: number,
}

const FolderCard: React.FC<Props> = ({ folderName, folderId }) => {
    const name = folderName.length > 20 ? `${folderName.substring(0, 17)}...` : folderName

    const dispatch = useDispatch<AppDispatch>();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const deleteFol = async () => {
        dispatch(reset());
        await dispatch(deleteFolder(folderId));
        setShowDeleteModal(false);
    }

    const router = useRouter();
  
    const handleDClick = () => {
      router.push(`/teacher/document/${folderId}`);
    }

    const selectedFolder = () => {
        dispatch(setSelectedFolder(folderId));
    }

    return (
        <Fragment>
            <Dropdown 
                overlay={
                    <ContextMenuFolder 
                        setShowEditModal={() => setShowEditModal(true)} 
                        setShowDeleteModal={() => setShowDeleteModal(true)}
                        selectedFolder={selectedFolder}
                    />
                }
                trigger={["contextMenu"]}
            >
                <div 
                    className="block p-4 max-w-lg mx-auto rounded-xl 
                    shadow-md flex justify-center items-center hover:bg-blue-100"
                    onDoubleClick={handleDClick}
                    onContextMenu={(e) => e.stopPropagation()}
                    title={folderName}
                >
                    <p className="text-black" style={{ cursor: 'default' }}>{name}</p>
                </div>
            </Dropdown>
            <ConfirmDelete isVisible={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={deleteFol} />
            <EditFolder isVisible={showEditModal} onClose={() => setShowEditModal(false)} folderName={folderName} folderId={folderId} />
        </Fragment>
    )
}


export default FolderCard;