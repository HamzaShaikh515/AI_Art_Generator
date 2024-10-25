
import { User } from "../models/user.models.js";
import Post from "../models/post.models.js";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userid) => {
  const user = await User.findById(userid);

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    
    console.log(req.body);
    
    // Check for missing fields
    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        message: "Every field is required",
      });
    }

    // Check if user already exists by username or email
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Create new user without hashing the password again
    const newUser = await User.create({ fullname, username, email, password });

    // Send success response
    return res
      .status(201)
      .json({ message: "User created successfully" });
  } catch (error) {
    // Handle server errors
    console.error('Error during user registration:', error); // Log the error for debugging
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};




// Login User
const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: "Username/Email and Password are required" });
    }

    const user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Set tokens as HTTP-only cookies
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};




const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1 // this removes the field from document
        }
      },
      {
        new: true
      }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "Logged out successfully"
      });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    
    // Ensure the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid old password"
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get Profile Details
const getProfileDetails = async (req, res) => {
  // Extracting userId from the request parameters
  const userId = req.params.userId || req.user._id; // Use the userId from params or the authenticated user's ID if not provided
  console.log("Fetching profile details for userId:", userId);

  try {
      // Find the user by their ID and exclude the password
      const user = await User.findById(userId).select("-password");

      // Fetch posts created by the user, sorted by creation date (most recent first)
      const posts = await Post.find({ userId })
          .sort({ createdAt: -1 })
          .populate('likes', 'username')
          .populate('dislikes', 'username')
          .populate('comments.userId', 'username')
          .exec();

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Respond with the user and their posts
      res.status(200).json({ success: true, user, posts });
  } catch (err) {
      console.error("Error fetching profile details:", err.message);
      res.status(500).json({ success: false, message: 'Error fetching user profile', error: err.message });
  }
};




export { registerUser, loginUser, logoutUser, changePassword, getProfileDetails };
