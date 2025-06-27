const mongoose = require('mongoose');

const JailSettingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    jailedRoleId: {
        type: String,
        required: true
    },
    unjailedRoleId: {
        type: String,
        required: true
    },
    jailLogChannelId: {
        type: String,
        required: true
    },
    jailedMembers: [{ type: String }] // قائمة بمُعرفات الأعضاء المسجونين
});

module.exports = mongoose.model('JailSettings', JailSettingsSchema);
