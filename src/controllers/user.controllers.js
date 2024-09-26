import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/AppError.js";
import { User } from "../models/user.models.js";
import { uploadImage } from "../utils/cloudnry.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body;

    // Field validation
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Email validation
    if (!email.includes("@gmail.com")) {
        throw new ApiError(402, "Please provide a valid Gmail address");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new ApiError(409, "User with the same username or email already exists");
    }

    // Image validation
    const avatarLocalpath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPaths = req.files?.coverimage?.map(file => file.path);  // Array of coverimage paths

    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // Upload avatar image
    const avatar = await uploadImage(avatarLocalpath);

    // Upload multiple cover images
    const coverImages = await Promise.all(coverImageLocalPaths.map(async (path) => {
        return await uploadImage(path);  // Upload each cover image
    }));

    // Handle case where avatar upload might fail
    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    // Create a new user
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverImages.map(img => img.url),  // Store array of cover image URLs
        email,
        password,
        username
    });

    // Retrieve the created user without sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Server error: Failed to retrieve user after creation");
    }

    // Respond with success
    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
});

export { registerUser };
