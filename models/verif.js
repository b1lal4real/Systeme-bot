// models/verif.js
const mongoose = require('mongoose');

const verifSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    unverifiedRoleId: { type: String, required: true },
    verifiedRoleId: { type: String, required: true },
    verifiedGirlRoleId: { type: String, required: true },
    verificatorRoleId: { type: String, required: true },
    logVerifChannelId: { type: String, required: true }
});

const Verif = mongoose.model('Verif', verifSchema);
module.exports = Verif;
