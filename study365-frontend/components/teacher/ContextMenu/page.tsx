import React from "react";
import { Menu } from "antd";
import { useParams } from "next/navigation";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import ContentPasteGoOutlinedIcon from '@mui/icons-material/ContentPasteGoOutlined';
import { useAppSelector, AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { updateFolder, copyFolder, reset } from "@/redux/features/folderSlice";

interface Props {
    setShowCreateModal: () => void;
    setShowCreateFolder: () => void;
}
//className="bg-white text-black border border-blue-100 rounded w-50"
const ContextMenuPage: React.FC<Props> = ({ setShowCreateModal, setShowCreateFolder}) => {
    const dispatch = useDispatch<AppDispatch>();

    const { selectedFolderId, cutOrCopy } = useAppSelector(state => state.folderReducer);

    const params = useParams();
    const id = params.id;
    let parentId = -1;
    if (id !== undefined) parentId = +id;

    const pasteFolder = async () => {
        if (cutOrCopy === "cut") {
            dispatch(reset());
            dispatch(updateFolder({folderId: selectedFolderId, parentId }));
            dispatch(reset());
        }
        if (cutOrCopy === "copy") {
            dispatch(reset());
            dispatch(copyFolder({ folderId: selectedFolderId, parentId }));
        }
    }

    return (
        <Menu 
            items={[
                {
                    label: <p className="text-md">Dán</p>,
                    key: "paste",
                    icon: <ContentPasteGoOutlinedIcon style={{ fontSize: "16px" }} />,
                    onClick: pasteFolder
                },
                {
                    label: <p className="text-md">Thêm tài liệu</p>,
                    key: "editfolder",
                    icon: <UploadFileOutlinedIcon style={{ fontSize: "16px" }} />,
                    onClick: setShowCreateModal
                },
                {
                    label: <p className="text-md">Thêm thư mục</p>,
                    key: "deletefolder",
                    icon: <DriveFolderUploadOutlinedIcon style={{ fontSize: "16px" }} />,
                    onClick: setShowCreateFolder
                },
            ]}
        >
        </Menu>
    )
}

export default ContextMenuPage;