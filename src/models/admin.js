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


adminSchema.pre('save', async (next) => {
  const admin = this;

  if (admin.password !== undefined) {
    const hash = bcrypt.hash(admin.password, 10);
    admin.password = hash;
  }
  next();
});

// adminSchema.methods.getAdminById = (id, callback) => {
//   Admin.findById(id, callback);
// };

// adminSchema.methods.getAdminByName = (username, callback) => {
//   const query = { username };
//   Admin.findOne(query, callback);
// };

adminSchema.methods.comparePasswords = async (password) => {
  const admin = this;
  const compare = await bcrypt.compare(password, admin.password);
  return compare;
};

module.exports = mongoose.model('admin', adminSchema);
