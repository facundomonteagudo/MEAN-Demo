import multer from "multer";

//MULTER
const MIME_TYPE_MAP: { [key: string]: string } = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };
  
  //Configuracion de multer
  //cb le devuelve las cosas a multer, basicamente ejecuto la logica que yo quiera para cada configuracion y se la devuelvo
  //a multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let isValidMimeType = MIME_TYPE_MAP[file.mimetype] ? true : false;
      let error = isValidMimeType ? null : new Error("Invalid Mime Type");
      cb(error, "public/images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(" ").join("-");
      const fileExtension = MIME_TYPE_MAP[file.mimetype]; //getting the file extension
      const fullName = name + "-" + Date.now() + "." + fileExtension;
      cb(null, fullName);
    },
  });

 export const multerImageReader = multer({ storage: storage }).single("image");