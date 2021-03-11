const fs = require('fs');
const fsPromise = fs.promises;
const uploadFile = require("../middleware/upload");

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res
                .status(400)
                .send({ message: "Please upload a file!" });
        }

        res
            .status(200)
            .send({
                message: "Uploaded the file successfully: " + req.file.originalname
            });
    } catch (err) {
        res
            .status(500)
            .send({ message: `Could not upload the file: ${req.file.originalname}. ${err}` });
    }
};

const saveFile = async (req, res) => {

    try {

        const data = JSON.stringify(req.body);
        const directoryPath = __basedir + "/resources/static/assets/uploads/";
        await fsPromise.writeFile(directoryPath + `${data.title}_${data.id}.txt`, data)

        res
            .status(200)
            .send({
                message: "Saved the file successfully: " + `${data.title}_${data.id}.txt`
            });
    } catch (err) {
        res
            .status(500)
            .send({ message: `Could not save the file: ${data.title}_${data.id}.txt. ${err}` });
    }
};

const getFileData = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + `/resources/static/assets/uploads/${fileName}.txt`;
    fs.readFile(directoryPath, (err, data) => {
        if (err) {
            res
                .status(500)
                .send({ message: "Unable to scan file!" });
        }
        res
            .status(200)
            .send(data);
    });
};

const getListFileData = async (req, res) => {

    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    const files = await fsPromise.readdir(directoryPath);
    const data = [];
    await Promise.all(files.map(async (file) => {
        const fileData = await fsPromise.readFile(directoryPath + file);
        data.push(JSON.parse(new String(fileData)));
    }));
    res
        .status(200)
        .send(data);
}

const getListFiles = (req, res) => {
    const baseUrl = req.protocol + "://" + req.headers.host + "/files/";
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res
                .status(500)
                .send({ message: "Unable to scan files!" });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file
            });
        });

        res
            .status(200)
            .send(fileInfos);
    });
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res
                .status(500)
                .send({
                    message: "Could not download the file. " + err
                });
        }
    });
};

const deleteFile = async (req, res) => {
    const data = JSON.stringify(req.body);
    const directoryPath = __basedir + `/resources/static/assets/uploads/${data.title}_${data.id}.txt`;

    try
    {
        fs.unlinkSync(directoryPath), then(data => {
             res
            .status(200)
            .send(data);
        });
       
    } catch (error) {
          res
                .status(500)
                .send({ message: "Unable to delete file!" });
    }

   
};

module.exports = {
    upload,
    saveFile,
    deleteFile,
    getFileData,
    getListFileData,
    getListFiles,
    download
};