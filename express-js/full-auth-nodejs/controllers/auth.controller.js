const User = require("../models/auth.model");
const expressJwttt = require("express-jwt");
// const _ = require("loadash");
// import {fetch} from "node-fetch";
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// register
exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((errors) => error.msg)[0];
    return res.status(422).json({ error: firstError });
  } else {
    User.findOne({ email }).exec((err, user) => {
      if (err) {
        return res.status(400).json({ error: "Email is taken already" });
      }
    });
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "5m",
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Activation Link",
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
                `,
    };
    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ success: false, errors: errorHandler(err) });
      });
  }
};

// Activation
exports.activationController = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decode) => {
      if (err) {
        console.log("Activation Error");
        return res.status(401).json({
          errors: "Link expired signup again",
        });
      } else {
        const { name, email, password } = jwt.decode(token);
        console.log(email);
        const user = new User(name, email, password);
        user.save((err, user) => {
          if (err) {
            console.log("Save error", errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              data: user,
              message: "Signup success",
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "Error happening please try again",
    });
  }
};

// Sign in
exports.signinController = (req, res)=>{
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((errors) => error.msg)[0];
        return res.status(422).json({ error: firstError });
    } else {
        User.findOne({
            email
        }).exec((err, user)=>{
            if (err || !user) {
                return res.status(400).json({
                    errors: 'User with email does not exist. Please signup'
                });
            }
            // Authentication
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    errors: 'Email and password do not match'
                })
            }
            // Generate token and send to client
            const token = jwt.sign({
                _id: user._id,
            },
                process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            });
            const { _id, name, email, hashed_password, role, timestamps } = user;
            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    timestamps,
                    hashed_password,
                    role
                }
            })
        })
    }
}

// To access  the route we need to protected the role (Access)
// exports.requireSignIn = expressJwt({
//     secret: process.env.JWT_SECRET // req._user._id
// })

// Let's Add Admin  middleware Access
exports.adminMiddleware = (req, res, next)=>{
    User.findById({
        _id: req.user._id
    }).exec((err, user)=>{
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource access denied'
            })
        }
        req.profile = user.profile;
        next();
    })
}

// Forgot Password
exports.forgotPasswordController = (req, res)=>{
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((errors) => error.msg)[0];
      return res.status(422).json({ error: firstError });
  } else {
    User.findOne({
      email
    },
    (err, user)=>{
      if (err || !user) {
        return res.status(400).json({
          error: 'User with that email does not exist'
      })
      }
      const token = jwt.sign({
        _id: user._id
      },
        process.env.JWT_FORGOT_PASSWORD,
      {
        expiresIn: '10m' // Token expires in 10 minutes
      });

      // We need to send email to the particular user to reset the password
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password Reset Link`,
        // i'm going to add HTML template here
        html: `
          <h1>Please use the following link to reset your password</h1>
          <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
          <hr/>
          <p>This email may contain sensitive information</p>
          <p>${process.env.CLIENT_URL}</p>
        `
      }
      return user.updateOne({
        resetPasswordLink: token
      }, (err, success)=>{
        if (err) {
          console.log('RESET PASSWORD LINK ERROR', err);
          return res.status(400).json({
            error: 'Database connection error'
          })
        } else {
          // Send Mail to user  to reset password using SendGrid
          sgMail
            .send(emailData)
            .then(sent => {
              return res.json({
                message: `Email has been sent to ${email}. following the instruction to reset your password`
              })
            })
            .catch(err=>{
              return res.json({
                message: err.message
              })
            })
        }
      });
    })
  }
}

// Google Login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT)

exports.googleController = (req, res)=>{
  const { idtoken } = req.body;
  client.verifyIdToken({idtoken, audience: process.env.GOOGLE_CLIENT})
    .then(response=>{
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({email}).exec((err, user)=>{
          if (user) {
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
              expiresIn: '7d'
            })
            const { _id, email, name, role } = data;
            return res.json({
              token,
              user: { _id, email, name, role }
            })
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({name, email, password});
            user.save((err, data)=>{
              if (err) {
                console.log(err);
                return res.status(400).json({
                  error: 'User SignUp failed with google'
                })
              }
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role }
              })
            })
          }
        })
      } else {
        return res.status(400).json({
          error: 'Google Login Failed. try again'
        })
      }
    })
}