const fs = require('fs');
const fsPromise = fs.promises;
const uploadFile = require('../middleware/upload');

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }
    res.status(200).send({
      message: 'Uploaded the file successfully: ' + req.file.originalname,
    });
  } catch (error) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${error.message}`,
    });
  }
};

const saveFile = async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    const directoryPath = __basedir + '/resources/static/assets/uploads/';
    await fsPromise.writeFile(
      directoryPath + `${req.body.title}_${req.body.id}.txt`,
      data,
    );
    res.status(200).send({
      message:
        'Saved the file successfully: ' +
        `${req.body.title}_${req.body.id}.txt`,
    });
  } catch (error) {
    res.status(500).send({
      message: `Could not save the file: ${req.body.title}_${req.body.id}.txt. ${error.message}`,
    });
  }
};

const getListFileData = async (req, res) => {
  const directoryPath = __basedir + '/resources/static/assets/uploads/';
  try {
    const files = await fsPromise.readdir(directoryPath);
    const data = [];
    await Promise.all(
      files.map(async (file) => {
        const fileData = await fsPromise.readFile(directoryPath + file);
        data.push(JSON.parse(new String(fileData)));
      }),
    );
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: `Could list file data. ${error.message}`,
    });
  }
};

const download = (req, res) => {
  const fileName = `${req.params.fileName}`;
  const filePath = __basedir + `/resources/static/assets/uploads/${fileName}`;
  try {
    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).send({
      message: `Could not download the file. ${error.message}`,
    });
  }
};

const deleteFile = async (req, res) => {
  const fileName = `${req.body.title}_${req.body.id}`;
  const directoryPath =
    __basedir + `/resources/static/assets/uploads/${fileName}.txt`;
  try {
    fs.unlinkSync(directoryPath);
    res.status(200).send({
      message: `Deleted file ${fileName}.txt successfully!`,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Unable to delete file! ${error.message}` });
  }
};

module.exports = {
  upload,
  saveFile,
  deleteFile,
  getListFileData,
  download,
};
