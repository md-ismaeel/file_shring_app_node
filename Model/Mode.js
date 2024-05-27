const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalFileName: {
        type: String,
    },
    newFileName: {
        type: String,
    },
    path: {
        type: String,
    }
})

const fileModel = mongoose.model('fileData', fileSchema);

module.exports = fileModel;