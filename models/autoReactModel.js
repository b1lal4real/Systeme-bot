const mongoose = require('mongoose');

// Schema definition for the auto-react feature
const autoReactSchema = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        unique: true
    },
    emoji: {
        type: String,
        required: true
    }
});

// Create the model from the schema and export it
const AutoReact = mongoose.model('AutoReact', autoReactSchema);

module.exports = AutoReact;
