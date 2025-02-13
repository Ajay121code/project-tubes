import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {Video} from '../models/video.model.js';
import {cloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const createVideo = asyncHandler( async(req, res) => {
    
    const { video, thumbnail, title, description, duration, owner } = req.body;

    if (!video || !thumbnail || !title || !description || !duration || !owner) {
        throw new ApiError(400, "All field are required!");
    }

    // if (!videoBase64.startsWith('data:video/mp4;base64,')) {
        
    //     videoBase64 = `data:video/mp4;base64,${videoBase64}`;
    //   }

    /* start : video upload logic */
    const uploadVideoResponse = await cloudinary.uploader.upload(video, {
        resource_type : "video",
        folder : "videos"
    });
    
    const videoUrl = uploadVideoResponse.secure_url; 
    /* end : video upload logic */

    /* start : image upload logic */
    const uploadImageResponse = await cloudinary.uploader.upload(thumbnail, {
        resource_type : "image",
        folder : "thumbnails"
    });
    
    const thumbnailUrl = uploadImageResponse.secure_url; 
    /* end : image upload logic */

    console.log(" [x] Debug :: ", videoUrl )
    const newVideo = new Video({
        videoFile : videoUrl,
        thumbnail : thumbnailUrl,
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