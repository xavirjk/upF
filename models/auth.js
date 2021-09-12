const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const authSchema = new Schema({
  Email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 80,
  },
});

const { statics, methods } = authSchema;

statics.createOne = async function (data) {
  const { email, password } = data;
  const hashedPassword = await hashedCode(password);
  console.log(email);
  console.log(hashedPassword);
  return await this.create({ Email: email, password: hashedPassword }).then(
    (res) => console.log('res', res),
    (err) => console.error('err', err)
  );
};

statics.findByEmail = async function (Email) {
  return await this.findOne({ Email });
};

methods.checkMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

statics.findForCredentials = async function ({ email, password }) {
  const user = await this.findByEmail(email);
  if (!user) return null;

  const matched = user.checkMatch(password);
  if (!matched) return null;
  return user;
};

const hashedCode = async (value) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(value, salt);
};

module.exports = mongoose.model('Auth', authSchema);
