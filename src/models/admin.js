const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        index: {
            unique: true,
        },
    },
    password: String,
    access: { type: String, enum: ['superadmin', 'admin'] },
});

// eslint-disable-next-line func-names
adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.password !== undefined) {
        const hash = await bcrypt.hash(admin.password, 10);
        admin.password = hash;
    }
    next();
});

// eslint-disable-next-line func-names
adminSchema.methods.comparePasswords = async function (password) {
    const admin = this;
    const compare = await bcrypt.compare(password, admin.password);
    return compare;
};

module.exports = mongoose.model('admins', adminSchema);
