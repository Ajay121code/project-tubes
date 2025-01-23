import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with same email or username already exists")
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath);
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // if (!avatar) {
    //     throw new ApiError(500, "Something went wrong while uploading avatar")
    // }

    const user = await User.create({
        fullName,
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email) {
        throw new ApiError(400, "Email is required!")
    }
    
    if (!password?.trim()) {
        throw new ApiError(400, "Password is required!")
    }
    const user = await User.findOne({
        $or : [{ email }]
    });

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isValidPassword = await user.isPasswordCorrect(password);
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password")
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save()

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    return res.status(200).json(
        new ApiResponse(200, "User logged in successfully", {
            user : loggedInUser,
            accessToken,
            refreshToken
        })
    );

})

export { registerUser, loginUser };

