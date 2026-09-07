// ============================================
// SWAY - Image Upload Middleware
// ============================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ============================================
// UPLOAD DIRECTORY
// ============================================

const uploadDirectory =
    path.join(__dirname, "..", "uploads");


// Create uploads folder if it doesn't exist

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


// ============================================
// STORAGE
// ============================================

const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                uploadDirectory
            );

        },


        filename: function (
            req,
            file,
            cb
        ) {

            const extension =
                path.extname(
                    file.originalname
                ).toLowerCase();


            const filename =
                `post-${Date.now()}-${Math.round(
                    Math.random() * 1E9
                )}${extension}`;


            cb(
                null,
                filename
            );

        }

    });


// ============================================
// FILE FILTER
// ============================================

const fileFilter =
    function (
        req,
        file,
        cb
    ) {

        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp"

        ];


        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG, GIF and WEBP images are allowed"
                ),
                false
            );

        }

    };


// ============================================
// MULTER CONFIGURATION
// ============================================

const upload =
    multer({

        storage: storage,

        fileFilter: fileFilter,

        limits: {

            fileSize:
                5 * 1024 * 1024

        }

    });


// ============================================
// EXPORT
// ============================================

module.exports =
    upload;