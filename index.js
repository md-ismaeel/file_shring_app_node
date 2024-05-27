const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./Routes/Routers')

const app = express()
const PORT = 10000;

app.use(express.json())
// app.use(express.urlencoded())


mongoose.connect('mongodb://localhost:27017/fileSharing')
    .then(() => console.log('MongoDb connection stablish successfully'))
    .catch((err) => console.log('Error MongoDb Not connected', err))

app.use(fileRoutes);

app.use('/*', (req, res) => {
    res.status(400).json({
        success: false,
        message: 'path not found'
    })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))