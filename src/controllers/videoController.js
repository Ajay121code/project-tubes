import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {Video} from '../models/video.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const createVideo = asyncHandler( async(req, res) => {
    
    const { videoFile, thumbnail, title, description, duration, owner } = req.body;

    if (!videoFile || !thumbnail || !title || !description || !duration || !owner) {
        throw new ApiError(400, "All field are required!");
    }

    const newVideo = new Video({
        videoFile,
        thumbnail,
        title,
        description,
        duration, 
        owner
    });

    await newVideo.save();
    res.status(201).json(new ApiResponse(201, "Video Uploaded Successfully!", newVideo));   

});

const getVideos = asyncHandler( async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const videos = await Video.find({ isPublished : true })
    .populate("owner", "username fullName email")
    .sort({createdAt : -1})
    .skip((page-1)*limit)
    .limit(parseInt(limit));

    res.status(200).json(new ApiResponse(200, "success", {videos, "count" : videos.length}));
})

/**
 * @desc Get a single video by ID
 * @route GET /videos/:id
 */
const getVideoById = asyncHandler( async (req, res) => {

    const video = await Video.findById(req.params.id).populate("owner", "username fullName email");

    if (!video) {
        return res.status(404).json({ message: "Video not found!" });
    }

    if (!video.isPublished && (!req.user || req.user._id.toString() !== video.owner._id.toString())) {
        return res.status(403).json(new ApiResponse(200, "success", {videos, "count" : videos.length}));
    }

    res.status(200).json({ success: true, video });
});

export { createVideo, getVideos, getVideoById };