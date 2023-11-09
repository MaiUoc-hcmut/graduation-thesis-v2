'use client'
import { useParams } from 'next/navigation';
import { useState } from 'react';
import FolderList from '@/components/teacher/List/Folder';
import DocumentList from '@/components/teacher/List/File';
import DocumentLayout from '@/components/teacher/Layout/Document';
import { Dropdown } from 'antd';
import ContextMenuPage from '@/components/teacher/ContextMenu/page';
import CreateDocumentModal from '@/components/teacher/Modal/createDocument';
import NewFolder from '@/components/teacher/Modal/newFolder';

const FolderPage = () => {
    const params = useParams()
    const id = params.id;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCreateFolder, setShowCreateFolder] = useState(false);

    const currentFolderId = parseInt(id as string, 10);

    return (
        <DocumentLayout>
            <Dropdown
                overlay={
                    <ContextMenuPage 
                        setShowCreateModal = {() => setShowCreateModal(true)}
                        setShowCreateFolder = {() => setShowCreateFolder(true)}
                    />
                }
            >
                <div className="gap-4 p-5 mt-10">
                    <FolderList currentFolderId={currentFolderId} />
                </div>
                <div className="gap-4 p-5 mt-10">
                    <DocumentList currentFolderId={currentFolderId} />
                </div>
            </Dropdown>
            <CreateDocumentModal 
                isVisible={showCreateModal} 
                parentId={+id}
                onClose={() => setShowCreateModal(false)} 
            />
            <NewFolder 
                isVisible={showCreateFolder}
                onClose={() => setShowCreateFolder(false)}
                folderId={+id}
            />
        </DocumentLayout>
    );
};

export default FolderPage;