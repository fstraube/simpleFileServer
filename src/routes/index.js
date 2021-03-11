const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.post("/save", controller.saveFile);
  router.post("/delete", controller.deleteFile);
  router.get("/fileData/:name", controller.getFileData);
  router.get("/listFileData", controller.getListFileData);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);

  app.use(router);
};

module.exports = routes;