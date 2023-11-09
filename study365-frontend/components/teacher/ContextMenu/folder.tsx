import React from "react";
import { Menu } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { setCutOrCopyState } from "@/redux/features/folderSlice";

interface Props {
    setShowEditModal: () => void;
    setShowDeleteModal: () => void;
    setSelectedFolder: () => void
}
//className="bg-white text-black border border-blue-100 rounded w-50"
const ContextMenuFolder: React.FC<Props> = ({ setShowEditModal, setShowDeleteModal, setSelectedFolder}) => {

    const dispatch = useDispatch<AppDispatch>();

    const setCut = () => {
        setSelectedFolder;
        dispatch(setCutOrCopyState("cut"))
    }

    const setCopy = () => {
        setSelectedFolder;
        dispatch(setCutOrCopyState("copy"))
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