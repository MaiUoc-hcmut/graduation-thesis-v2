const multer = require('multer');

class FileUpload {
    uploadCourseFiles = multer({ storage: multer.memoryStorage() }).array('courseFiles');
    uploadVideo = multer({ storage: multer.memoryStorage() }).single('video');

    uploadImageComment = multer({ storage: multer.memoryStorage() }).single('image');
    
    giveCurrentDateTime = () => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const dateTime = date + ' ' + time;
        return dateTime;
    };
}

module.exports = new FileUpload();
