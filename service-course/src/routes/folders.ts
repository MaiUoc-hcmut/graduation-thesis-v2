const express = require('express');
const router = express.Router();

const FolderController = require('../app/controllers/FolderController');
const Authorize = require('../app/middleware/teacherAuth');

// router.route('/')
//     .get(FolderController.getAllFolders);
router.route('/getFolderById/:folderId')
    .get(FolderController.getFolderById);
    
router.route('/getSubFolder')
    .get(FolderController.getFoldersByParent);
router.route('/getSubFolder/:parentId')
    .get(FolderController.getFoldersByParent);

router.route('/create')
    .post(Authorize.protectedAPI, FolderController.createFolder);
router.route('/create/:parentId')
    .post(Authorize.protectedAPI, FolderController.createFolder);

router.route('/copy')
    .post(Authorize.protectedAPI, FolderController.copyFolder);
router.route('/copy/:parentId')
    .post(Authorize.protectedAPI, FolderController.copyFolder);

router.route('/update/:folderId')
    .put(Authorize.protectedAPI, FolderController.updateFolder);

router.route('/delete/:folderId')
    .delete(Authorize.protectedAPI, FolderController.deleteFolder);
    
module.exports = router;