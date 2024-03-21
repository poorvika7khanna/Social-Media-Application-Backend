const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Blacklist = require("../models/blacklist");
const { constants } = require("../constants");
const { isAdmin } = require("../helpers/adminHelper");
const { getProfileDetails } = require("../helpers/profileHelper")

// @desc Register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req,res) => {
    const {
        username,
        email,
        password,
        phone,
        bio,
        image_url,
    } = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        phone: phone || null,
        bio: bio || null,
        image_url: image_url || null,
        profileType: "PUBLIC",
        role: "USER",
        authMethod: "PASSWORD",
    });
    console.log("User created: ",user);
    if(user)
    {
        res.status(201).json({_id: user.id, email: user.email});
    } else {
        res.status(400);
        throw new Error("User data not valid");
    }
});

// @desc Login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });
    // compare password with hashedPassword
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or Password is not valid");
    }
});


// @desc Current user info
// @route POST /api/users/current
// @access private
const getUserInfo = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user.id);
    const profileDetails = getProfileDetails(user);
    res.json(profileDetails);
});

// @desc logout user
// @route POST /api/users/logout
// @access private
const logoutUser = asyncHandler(async (req,res) => {
    let authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader.split(" ")[1];
    const blackListedToken = await Blacklist.create({ token });
    res.status(200).json({message:`Signed out of account with id: ${req.user.id}`});
});

// @desc update user password
// @route PUT /api/users/update-password
// @access private
const updatePassword = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user.id);
    if(!user)
    {
        res.status(404);
        throw new Error("User not found");
    }
    const updatedPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : null;
    console.log("New password:", updatedPassword);
    if(!updatedPassword)
    {
        res.status(400);
        throw new Error("New password is missing or invalid");
    }
    user.password = updatedPassword;
    await user.save();
    res.status(200).json({message:`Password updated successfully for id: ${req.user.id}`});
});

// @desc update user photo
// @route PUT /api/users/upload-photo
// @access private
const updateImageUrl = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user.id);
    if(!user)
    {
        res.status(404);
        throw new Error("User not found");
    }
    const updatedImageUrl = req.body.image_url;
    if(!updatedImageUrl)
    {
        res.status(400);
        throw new Error("New photo url is missing or invalid");
    }
    user.image_url = updatedImageUrl;
    await user.save();
    res.status(200).json({message:`Photo uploaded successfully for id: ${req.user.id}`});
});

// @desc change profile to public or private
// @route PUT /api/users/change-profile-type
// @access private
const changeProfileType = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user.id);
    if(!user)
    {
        res.status(404);
        throw new Error("User not found");
    }
    const newProfileType = req.body.profileType ? req.body.profileType.toUpperCase() : null;

    if(!newProfileType || !constants.VALID_PROFILE_TYPES.includes(newProfileType))
    {
        res.status(400);
        throw new Error("Profile type is missing or invalid");
    }
    user.profileType = newProfileType;
    await user.save();
    res.status(200).json({message:`Updated profileType successfully for id: ${req.user.id}`});
});

// @desc get other profiles
// @route GET /api/users/profiles
// @access private
const getAllProfiles = asyncHandler(async (req,res) => {
    if(!isAdmin(req))
    {
        return getPublicProfiles(req,res);
    }
    // const allProfiles = await User.find({  })
});

const getPublicProfiles = asyncHandler(async (req,res) => {

});

module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    logoutUser,
    updatePassword,
    updateImageUrl,
    changeProfileType,
    getAllProfiles
}