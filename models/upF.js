const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const upFSchema = new Schema({
  pcode: {
    type: String,
    maxlength: 100,
    required: true,
    minlength: 10,
    unique: true,
  },
  files: [String],
  userId: {
    type: ObjectId,
    required: false,
  },
});

const { statics, methods } = upFSchema;

statics.createOne = async function (data) {
  const hashedPCODE = await hashedCode(data.PCODE);
  return await this.create({ pcode: hashedPCODE });
};

statics.findOneForPcode = async function (pcode) {
  return await this.findOne({ pcode });
};

statics.findOneForPcodeUpload = async function (pcode) {
  const all = await this.find({});
  for (let val of all) {
    const matched = await val.checkMatch(pcode);
    if (matched) return val;
  }
  return null;
};

methods.editFiles = async function (arr) {
  this.files = this.files.concat(arr);
  await this.save();
};

const hashedCode = async (value) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(value, salt);
};

methods.checkMatch = async function (pcode) {
  return await bcrypt.compare(pcode, this.pcode);
};

module.exports = new mongoose.model('Upf', upFSchema);
