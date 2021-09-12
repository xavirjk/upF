const mongoose = require('mongoose');

const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const upFSchema = new Schema({
  upf_id: {
    type: ObjectId,
    required: true,
  },
  code: {
    type: Number,
    maxlength: 6,
    minlength: 4,
    required: true,
  },
});

const { statics, methods } = upFSchema;

statics.createOne = async function (data) {
  return await this.create(data);
};

statics.findCode = async function (code) {
  return await this.findOne({ code });
};

methods.deleteCode = async function () {
  return await this.delete();
};
module.exports = new mongoose.model('Ver', upFSchema);
