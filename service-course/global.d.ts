declare global {
    namespace Express {
        interface Request {
            teacher?: any;
        }
    }
    
    interface RequestWithFile extends Request {
        file: Express.Multer.File;
        files: Express.Multer.File[];
    }

    namespace Express.Multer {
        interface File {
            thumbnail: Express.Multer.File;
            cover: Express.Multer.File;
        }
    }
}

const formdata = new FormData();
let video = "GT12.mp4";
video = "2-" + "3-" + video;

export {};