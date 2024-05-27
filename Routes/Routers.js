
const express = require('express');
const controllerModel = require('../Controller/Controller');
const { uploadFiles, generateDynamicLink, downloadFile, sendFile, } = controllerModel;

const router = express.Router()

router.post('/api/files/', uploadFiles)


router.get('/api/files/:uuid', generateDynamicLink)

router.get('/api/files/download/:uuid', downloadFile)


router.post('/api/files/send', sendFile)

module.exports = router;