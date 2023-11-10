'use client'
import React, { useEffect } from "react";
import { Menu } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { setCutOrCopyState, reset, setSelectedFolder } from "@/redux/features/folderSlice";

interface Props {
    setShowEditModal: () => void;
    setShowDeleteModal: () => void;
    selectedFolder: () => void
}
//className="bg-white text-black border border-blue-100 rounded w-50"
const ContextMenuFolder: React.FC<Props> = ({ setShowEditModal, setShowDeleteModal, selectedFolder}) => {

    const { isUpdateSuccess, isUpdateFailed } = useAppSelector(state => state.folderReducer);

    const dispatch = useDispatch<AppDispatch>();

    const setCut = () => {
        selectedFolder();
        dispatch(reset());
        dispatch(setCutOrCopyState("cut"))
        dispatch(reset());
    }

    const setCopy = () => {
        selectedFolder();
        dispatch(reset());
        dispatch(setCutOrCopyState("copy"))
        dispatch(reset());
    }

    return (
        <Menu 
            items={[
                {
                    label: <p className="text-md">Sao chép</p>,
                    key: "copy",
                    icon: <ContentCopyOutlinedIcon style={{ fontSize: "16px" }} />,
                    onClick: setCopy
                },
                {
                    label: <p className="text-md">Cắt</p>,
                    key: "cut",
                    icon: <ContentCutOutlinedIcon style={{ fontSize: "16px" }} />,
                    onClick: setCut
                },
                {
                    label: <p className="text-md">Chỉnh sửa thư mục</p>,
                    key: "editfolder",
                    icon: <ModeEditOutlinedIcon style={{ fontSize: "16px" }} />,
                    onClick: setShowEditModal
                },
                {
                    label: <p className="text-md">Xóa thư mục</p>,
                    key: "deletefolder",
                    icon: <DeleteForeverRoundedIcon style={{ fontSize: "16px" }} />,
                    danger: true,
                    onClick: setShowDeleteModal
                },
            ]}
        >
        </Menu>
    )
}

export default ContextMenuFolder;