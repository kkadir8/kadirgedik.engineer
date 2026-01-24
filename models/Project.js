/**
 * Project Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    title_en: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    description_en: {
        type: String
    },
    technologies: [{
        type: String,
        trim: true
    }],
    imageUrl: {
        type: String,
        default: '/media/default-project.jpg'
    },
    images: [{
        type: String
    }],
    liveUrl: {
        type: String
    },
    githubUrl: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'ai', 'robotics', 'other'],
        default: 'web'
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
