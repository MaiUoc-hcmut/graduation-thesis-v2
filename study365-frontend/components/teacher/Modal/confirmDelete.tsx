

type Props = {
    isVisible: boolean,
    onClose: () => void,
    onDelete: () => void,
}

const ConfirmDelete: React.FC<Props> = ({ isVisible, onClose, onDelete }) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === 'wrapper') onClose(); 
    }

    return (
        <div
            className="
            fixed inset-0 bg-black bg-opacity-25 
            backdrop-blur-sm flex justify-center items-center"
            id="wrapper"
            onClick={handleClose}
        >
            <div className="w-[400px]">
                <div className="bg-white p-4 rounded flex flex-col justify-center items-center">
                    <p className="font-bold text-black mb-5">Xác nhận xóa tài liệu</p>
                    <div className="flex justify-between">
                        <button
                            type="button" 
                            className="focus:outline-none text-blue-500 focus:ring-2
                                font-medium rounded-xl text-sm px-5 py-2.5 border hover:bg-gray
                                bg-transparent border-blue-500 font-bold w-20 mr-2"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit" 
                            className="focus:outline-none text-white focus:ring-2
                                font-medium rounded-xl text-sm px-5 py-2.5 dark:bg-red-500 
                                dark:hover:bg-red-700 font-bold w-20 ml-2"
                            onClick={onDelete}
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete;