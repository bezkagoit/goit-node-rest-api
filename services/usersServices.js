import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import gravatar from "gravatar";
import mail from "../mail.js";
import crypto from "node:crypto";

async function registerUser({ email, password, subscription }) {
  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return null;
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomUUID();

    mail.sendEmail({
      to: email,
      from: "noreply@domain.com",
      subject: "Welcome to our platform!",
      html: `Please confirm your email address by clicking on <a href='http://localhost:3000/users/verify/${verificationToken}'> link </a>`,
      text: `To confirm your email address please use link http://localhost:3000/users/verify/${verificationToken}`,
    });
    const newUser = await User.create({
      email,
      password: passwordHash,
      subscription,
      avatarURL: gravatar.url(email),
      verificationToken,
    });
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });

    if (user === null) {
      console.log("user not found");
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password does not match");
      throw new Error("Email or password is incorrect");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    return { token, user };
  } catch (error) {
    console.log("Error in loginUser:", error.message);
    throw new Error(error.message);
  }
}

async function currentUser(authorizationHeader) {
  try {
    const token = authorizationHeader.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    if (user === null) {
      throw new Error("User not found");
    }
    return {
      email: user.email,
      subscription: user.subscription,
    };
  } catch (error) {
    throw new Error("Invalid token or user not found");
  }
}

async function logoutUser(userId) {
  await User.findByIdAndUpdate(userId, { token: null }, { new: true });
}

async function updateSubscription(userId, subscription) {
  try {
    const data = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function updateUserAvatar(userId, avatarURL) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error("Error updating avatar");
  }
}

async function getUserAvatar(id) {
  try {
    const user = await User.findById(id);

    return user.avatarURL;
  } catch (error) {
    throw new Error("Error getUser avatar");
  }
}

async function verifyUser(verificationToken) {
  try {
    const user = await User.findOne({ verificationToken });
    if (user === null) {
      return null;
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    return user;
  } catch (error) {
    throw new Error("Error verify user");
  }
}

async function resendVerifyEmail(email) {
  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return null;
    }

    if (user.verify === true) {
      return true;
    }
    mail.sendEmail({
      to: email,
      from: "noreply@domain.com",
      subject: "Welcome to our platform!",
      html: `Please confirm your email address by clicking on <a href='http://localhost:3000/users/verify/${user.verificationToken}'> link </a>`,
      text: `To confirm your email address please use link http://localhost:3000/users/verify/${user.verificationToken}`,
    });
    return user;
  } catch (error) {
    throw error;
  }
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
  updateUserAvatar,
  getUserAvatar,
  verifyUser,
  resendVerifyEmail,
};
