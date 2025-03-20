const mongoose = require('mongoose')

const HomeSchema = new mongoose.Schema({
    title: { String, required: true },
    description: { String }
})