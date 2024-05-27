const fileModel = require("../Model/Mode");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "localHost",
    port: 1025,
    secure: false,
});

const directoryPath = path.join(__dirname, "..", "Files");
console.log("file", directoryPath);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, directoryPath),
    filename: (req, file, cb) => {
        const fileName = uuidv4() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
}).single("file"); // FieldName in your formate



const uploadFiles = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log("ERROR WHILE UPLOADING FILE", err);
            return res.status(500).json({
                success: false,
                message: "Something went wrong, please try again after sometime",
            });
        }

        // console.log("h", req.file);

        const newObj = new fileModel({
            originalFileName: req.file.originalName,
            newFileName: req.file.filename,
            path: req.file.path,
            size: req.file.size,
        });

        const insertedData = await newObj.save();

        res.json({
            success: true,
            message: "File uploaded successfully",
            fileId: insertedData._id,
        });
    });
};

const generateDynamicLink = async (req, res) => {
    try {
        const fileId = req.params.uuid;

        const file = await fileModel.findById(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File with given ID not found",
            });
        }
        // console.log(fileId);

        res.json({
            success: true,
            message: "Generate dynamic link API",
            result: `http://localhost:10000/api/files/download/${fileId}`,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again after sometime" + err,
        });
    }
};

const downloadFile = async (req, res) => {
    try {
        const fileId = req.params.uuid;
        const file = await fileModel.findById(fileId);
        if (!file) {
            return res.end("File with given ID not found");
        }

        res.download(file.path, file.originalFileName);
    } catch (err) {
        res.end("Something went wrong please try agin after some time");
    }
};

const sendFile = async (req, res) => {
    try {
        console.log(req.body);
        const { fileId, shareTo } = req.body;
        const downloadableLink = `http://localhost:10000/api/files/download/${fileId}`;

        console.log(downloadableLink)
        const info = await transporter.sendMail({
            from: "do-not-reply@file-sharing-app.com", // sender address
            to: shareTo, // list of receivers
            subject: "A downloadable link sent on email  ✔", // Subject line
            html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Download Link</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        h1 {
                            color: #333333;
                        }
                        p {
                            color: #666666;
                        }
                        .download-link {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #007BFF;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                        .download-link:hover {
                            background-color: #0056b3;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Hello,</h1>
                        <p>We are excited to share with you our latest document. Please click the link below to download it:</p>
                        <a href="${downloadableLink}" class="download-link" download>Download Now</a>
                    </div>
                </body>
            </html>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        res.json({
            success: true,
            message: "Send file successfully",
        });

    } catch (err) {

        res.json({
            success: false,
            message: "Something went wrong please try agin after some time", err,
        });
    }
};

const controllerModel = {
    uploadFiles,
    generateDynamicLink,
    downloadFile,
    sendFile,
};

module.exports = controllerModel;
