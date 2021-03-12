const express = require('express');
const router = express.Router();
const controller = require('../controller/file.controller');

let routes = (app) => {
  router.post('/upload', controller.upload);
  router.post('/saveFile', controller.saveFile);
  router.post('/deleteFile', controller.deleteFile);
  router.get('/listFileData', controller.getListFileData);
  router.get('/download/:fileName', controller.download);

  app.use(router);
};

module.exports = routes;
