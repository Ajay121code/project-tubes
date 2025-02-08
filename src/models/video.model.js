import mongoose, { Schema } from "mongoose";
import mongooseaggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }, 
        tags: [{
            type: String
        }],
        deletedAt: {
            type: Date,
            default: null
        }
    }, 
    {
        timestamps: true
    }
)

// adding indexing on the following keys : owner, is_published, views 
videoSchema.index({ owner: 1 });
videoSchema.index({ isPublished: 1 });
videoSchema.index({ views: -1 });

videoSchema.plugin(mongooseaggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);