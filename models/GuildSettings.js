// models/GuildSettings.js
const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now },
    warnedBy: { type: String, required: true }
});

const guildSettingSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    warnings: [warningSchema]
});

module.exports = mongoose.model('GuildSettings', guildSettingSchema);
