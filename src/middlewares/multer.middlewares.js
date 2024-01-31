// this is use a middleware

import multer from "multer"

const storage = multer.diskStorage({
    // file multer se aa rha h
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname )
    }
  })
  
 export  const upload = multer({ storage })
  