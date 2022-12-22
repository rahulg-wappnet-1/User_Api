const {
  failed,
  missing,
  invalid,
  notFound,
  success,
  success2,
  forbidden,
} = require('../utils/response');
const cookies = require('../utils/cookieToken');
const cloudinary = require('cloudinary');
const User = require('../models/user');
const {
  imageArrayMaker,
  updateUserService,
  updateUserServiceWithoutFile,
} = require('../services/userService');

//user signup
//required fileds :- name,email,password,photo
exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(missing(res, 'All fields required'));
  } else if (!req.files) {
    return next(missing(res, 'Image required to sign up'));
  }

  let file = req.files.photo;
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: 'users',
    width: 150,
    crop: 'scale',
  });

  const user2 = await User.findOne({ email });
  if (!user2) {
    const user = await User.create({
      name,
      email,
      password,
      photo: {
        id: result.public_id,
      },
    });
    cookies(user, res);
  } else {
    invalid(res, 'Email already exist');
  }
};

//user login
//required fields :- email, password
exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(missing(res, `All fields required`));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(notFound(res, `User does not exists`));
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return next(missing(res, `Email or password does not match`));
  }
  cookies(user, res);
};

//user logout
exports.logOut = async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  next(success(res, `Logged out`));
};

//update user role
//accessable only by admin
exports.setRole = async (req, res, next) => {
  const { email, role } = req.body;
  const filter = { email: email };
  const update = { role: role };

  let user = await User.findOneAndUpdate(filter, update, {
    returnOriginal: false,
  });

  if (!user) {
    return next(notFound(res, `User does not exists`));
  }

  next(success(res, `Role updated as ${role}`));
};

//searching user by email
exports.findUserByEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(missing(res, `Please enter the required credentials`));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(notFound(res, 'Not found'));
  }
  next(success2(user, res));
};

//user update
//allowed when signed in
exports.updateUser = async (req, res, next) => {
  const newData = {};

  //const user = await User.findById(req.user.id)
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(forbidden(res, `Please login to access`));
  }
  if (req.body.name) {
    const name = req.body.name;
    newData.name = name;
  }

  if (req.body.email) {
    const { email } = req.body;

    const temp_user = User.findOne({ email });
    if (!temp_user) {
      newData.email = req.body.email;
    } else {
      return next(invalid(res, `Email already exists`));
    }
  }

  if (req.files) {
    let file = req.files.photo;
    const photoId = user.photo.id;
    //deleting the photo
    const res = await cloudinary.v2.uploader.destroy(photoId);
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: 'users',
      width: 150,
      crop: 'scale',
    });

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user2 = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  next(success2(user2, res));
};

//user delete
//accesable by admin user
exports.deleteUser = async (req, res, next) => {
  const { email } = req.body;
  const user = User.findOne({ email });
  if (!user) {
    return next(notFound(res, `User not found`));
  }
  User.deleteOne({ email: email }, function (err) {
    if (err) console.log(err);
    next(success(res, `User with email id: ${email} is deleted`));
  });
};

//updates or add documents in user model
//can upload multile files
exports.addDocuments = async (req, res, next) => {
  const { docType, file_available } = req.body;

  let imageArray = await imageArrayMaker(req, res, next);
  let j = 0;
  for (let i = 0; i < docType.length; i++) {
    switch (docType[i]) {
      case 'adhar_card':
        if (file_available[i] === 'YES') {
          updateUserService(req, res, next, i, imageArray[j], 'adhar_card');
          j++;
        } else {
          console.log(
            await updateUserServiceWithoutFile(req, res, next, i, 'adhar_card')
          );
        }
        break;
      case 'pan_card':
        if (file_available[i] === 'YES') {
          console.log('enter 11');
          updateUserService(req, res, next, i, imageArray[j], 'pan_card');
          j++;
        } else {
          console.log(
            await updateUserServiceWithoutFile(req, res, next, i, 'pan_card')
          );
        }
        break;
      case 'passport':
        if (file_available[i] === 'YES') {
          updateUserService(req, res, next, i, imageArray[j], 'passport');
          j++;
        } else {
            await updateUserServiceWithoutFile(req, res, next, i, 'passport')
        }
        break;

      default:
        invalid(res,'Invalid type of document')
        break;
    }
  }
  const user = await User.findById(req.user.id);
    res.send(user)
};
