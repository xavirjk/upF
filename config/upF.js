const router = require('express').Router();

const { upF } = require('../controllers');

router.post('/create/', upF.postNewPCODE);
router.post('/upload/', upF.postUploadFiles);
router.get('/getPCODE/', upF.getRequested);
router.get('/getfiles/', upF.getFiles);

module.exports = router;
