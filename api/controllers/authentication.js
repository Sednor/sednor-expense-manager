const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.register = (req, res) => {
  if(!req.body.email || !req.body.password || !req.body.confirmPassword) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  if(req.body.password !== req.body.confirmPassword) {
    sendJSONresponse(res, 400, {
      "message": "Passwords don't match"
    });
    return;
  }

  const user = new User();

  user.email = req.body.email;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.setPassword(user, req.body.password);
  user.save((err) => {
    const token = user.generateJwt(user);

    res.status(200);
    res.json({
      'token': token
    });
  });

};

module.exports.login = (req, res) => {
  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      const token = user.generateJwt(user);

      res.status(200);
      res.json({
        'token': token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};