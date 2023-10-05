import React, { useState } from 'react';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ModalEditDocument from '../Modal/editDocumentCard';
import Modal from 'react-modal';

interface Document {
  title: string;
  lastUpdated: string;
  class: string;
  subject: string;
  level: string;
  url: string;
}

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const fileName = document.title.length > 20 ? `${document.title.substring(0, 17)}...` : document.title;
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsOpen(true);
  }

  const handleCloseEditModal = () => {
    setIsOpen(false);
  }

  return (
    <div className="block p-6 max-w-lg mx-auto rounded-xl shadow-md items-center">
        
        {/* Part 1 */}
        <div className="flex justify-between items-center">
            <a href={document.url} download className="title-xsm font-medium text-blue-700">gif gif ddos</a>
            <div className="mt-2">
                <a className="py-1 px-1" target='blank' href={document.url}>
                  <RemoveRedEyeOutlinedIcon className='text-black' />
                </a>
                <button className="py-1 px-1" onClick={handleOpenEditModal}>
                  <ModeEditOutlinedIcon className='text-black' />
                </button>
                <Modal
                  isOpen={isOpen}
                  onRequestClose={handleCloseEditModal}
                  contentLabel='Document edit'
                  className='modal'
                >
                  <ModalEditDocument />
                  <h1>Hello</h1>
                </Modal>
                <button className="py-1 px-1">
                  <DeleteForeverRoundedIcon className='text-black' />
                </button>
            </div>
        </div>

        {/* Part 2 */}
        <p className="block text-gray-500">Last updated</p>

        {/* Part 3 */}
        <div className="flex text-black justify-between">
            <p>Grade 10</p>
            <p>Math</p>
            <p>Advanced</p>
        </div>
    </div>
  );
};

export default DocumentCard;
