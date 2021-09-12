const { Auth } = require('../models');
const { signin } = require('../context/config');

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Auth.findForCredentials({ email, password });

  if (!user) {
    res.status(401).send({ error: 'Invalid Email or Password' });
    return;
  }

  const cb = (err, token) => {
    try {
      if (err) return next(err);
      const data = {
        success: true,
        token: 'Bearer ' + token,
      };
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };
  return signin({ id: user.id }, cb, { expiresIn: 3600 });
};
