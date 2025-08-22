import User from "../../DB/models/user.model.js";
import Token from "../../DB/models/token.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Sign Up
export const signUp = async (req, res, next) => {
  try {
    const {
      email,
      mobileNumber,
      password,
      recoveryEmail,
      DOB,
      lastName,
      firstName,
    } = req.body;

    // Check if user with the email or mobile number already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      mobileNumber,
      password: hashedPassword,
      recoveryEmail,
      DOB,
      lastName,
      firstName,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// Sign In
export const signIn = async (req, res, next) => {
  try {
    const { emailOrMobile, password } = req.body;

    // Find user by email or mobile number
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id; // Extract user ID from the authenticated request

    // Check if the request body contains fields to update
    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
      req.body;
    const updates = {};
    if (email) updates.email = email;
    if (mobileNumber) updates.mobileNumber = mobileNumber;
    if (recoveryEmail) updates.recoveryEmail = recoveryEmail;
    if (DOB) updates.DOB = DOB;
    if (lastName) updates.lastName = lastName;
    if (firstName) updates.firstName = firstName;

    // Update the user data
    await User.findByIdAndUpdate(userId, updates);

    res.status(200).json({ message: "User data updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id; // Extract user ID from the authenticated request

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get User Data
export const getUserData = async (req, res, next) => {
  try {
    const userData = {
      email: req.user.email,
      mobileNumber: req.user.mobileNumber,
      recoveryEmail: req.user.recoveryEmail,
      DOB: req.user.DOB,
      lastName: req.user.lastName,
      firstName: req.user.firstName,
    };

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// Get Profile Data
export const getProfileData = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Extract user ID from request params

    // Find the user by ID
    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct profile data object
    const profileData = {
      email: userProfile.email,
      mobileNumber: userProfile.mobileNumber,
      recoveryEmail: userProfile.recoveryEmail,
      DOB: userProfile.DOB,
      lastName: userProfile.lastName,
      firstName: userProfile.firstName,
      // Add additional fields if needed
    };

    res.status(200).json(profileData);
  } catch (error) {
    next(error);
  }
};

// Update Password
export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id; // Extract user ID from the authenticated request
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Forget Password
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a temporary password (you can use a library like 'randomstring' for this)
    const temporaryPassword = generateTemporaryPassword();

    // Update the user's password with the temporary password
    user.password = await bcrypt.hash(temporaryPassword, 10);
    await user.save();

    // Send the temporary password to the user via email or another secure method

    res.status(200).json({ message: "Temporary password sent successfully" });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate a temporary password
const generateTemporaryPassword = () => {
  // Implement logic to generate a random temporary password here
};

// Get Accounts By Recovery Email
export const getAccountsByRecoveryEmail = async (req, res, next) => {
  try {
    const { recoveryEmail } = req.params;

    // Find users with the specified recovery email
    const accounts = await User.find({ recoveryEmail });

    res.status(200).json({ accounts });
  } catch (error) {
    next(error);
  }
};

export default router;
