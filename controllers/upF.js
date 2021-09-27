const models = require('../models');
const { Esender } = require('../services');
exports.postNewPCODE = async (req, res, next) => {
  try {
    const { body, headers } = req;
    const ref = extractRefAsBearer(headers.reference);
    const upF = await models.upF.createOne(body);
    if (upF) {
      var code = activationCode();
      const result = await Esender(ref, code)
        .then((success) => success)
        .catch((err) => {
          res.status(501).send({ message: 'Not created, Mailing failed' });
          return null;
        });
      if (!result) return;
      await models.Ver.createOne({ upf_id: upF.id, code: code });
      res.status(201).send({ message: 'PCODE success' });
    } else res.status(304).send({ message: 'PCODE Not created' });
  } catch (error) {
    next(error);
  }
};

exports.postUploadFiles = async (req, res, next) => {
  try {
    const { files, headers } = req;
    if (files == null) {
      res.status(501).send({ message: 'please select file' });
      return;
    }
    const ref = extractRefAsBearer(headers.reference);
    var fileNames = [];
    var path = '';
    var isArray = Array.isArray(files.uploads);
    if (isArray) {
      for (file of files.uploads) {
        path = await saveFileAndReturnArray(file);
        fileNames.push(path);
      }
    } else {
      path = await saveFileAndReturnArray(files.uploads);
      fileNames.push(path);
    }
    const peer = await models.upF.findOneForPcodeUpload(ref);
    if (!peer) {
      res.status(404).send({ message: 'Ref Not-found' });
      return;
    }
    await peer.editFiles(fileNames);
    res.status(201).send({ message: 'File(s) Uploaded' });
  } catch (error) {
    next(error);
  }
};

exports.getRequested = async (req, res, next) => {
  const { headers } = req;
  const data = await models.Ver.findCode(decodeFromBase64(headers.code));
  if (!data) {
    res.status(404).send({ message: 'Invalid code' });
    return;
  }
  const upf = await models.upF.findById(data.upf_id);
  await data.deleteCode();
  res.status(200).send({ message: 'pcode success', PCODE: upf.pcode });
};

exports.getFiles = async (req, res, next) => {
  const { headers } = req;
  const upf = await models.upF.findOneForPcode(decodeFromBase64(headers.files));
  if (!upf) {
    res.status(404).send({ message: 'Not found' });
    return;
  }
  res.status(200).send({
    message: 'files found',
    files: { code: upf.pcode, files: upf.files },
  });
};

const extractRefAsBearer = (ref) => {
  return Buffer.from(
    ref.substring('Bearer '.length, ref.length),
    'base64'
  ).toString();
};

const activationCode = () => {
  var code = '';
  while (code.length < 6) {
    var val = Math.floor(Math.random() * 10);
    code += val;
  }
  return code;
};

async function saveFileAndReturnArray(file) {
  var uploadPath = 'Data/' + Math.random() + '-' + file.name;
  await file.mv(uploadPath, function (err) {
    if (err) {
      next(err);
      return false;
    }
  });
  return uploadPath;
}

function decodeFromBase64(encoded) {
  return Buffer.from(encoded, 'base64').toString();
}
