import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../tmp/my-uploada");
  },
  filename: function (req, file, cb) {
    const id = uuid();
    const FileExt = file.originalname.split(".").pop()
    // console.log(FileExt)
    cb(null, `${id}.${FileExt}`);
    // console.log(file)ls
    
  }
});

export const uploadFiles = multer({ storage })

// export const  = upload.single('files'); // Adjust 'files' to the name of the form field you are expecting
