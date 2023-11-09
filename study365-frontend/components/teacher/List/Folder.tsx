'use client'
import React, { useEffect } from "react";
import { getFoldersByParent, reset } from "@/redux/features/folderSlice";
import { useAppSelector, AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import FolderCard from "../Card/folder";

interface Props {
    currentFolderId: number
}

const FolderList: React.FC<Props> = ({ currentFolderId }) => {

    const dispatch = useDispatch<AppDispatch>();

    const { isGetFailed, isGetSuccess, message, selectedFolderId } = useAppSelector(state => state.folderReducer);
    const myFolders = useAppSelector(state => state.folderReducer.folders);

    useEffect(() => {
        dispatch(getFoldersByParent(currentFolderId));
    }, [currentFolderId, selectedFolderId]);

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

    const folderListRender = myFolders.map(folder => {
        return (
            <FolderCard key={folder.id} folderName={folder.name} folderId={folder.id} />
        )
    })

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {folderListRender}
        </div>
    )
}

export default FolderList;