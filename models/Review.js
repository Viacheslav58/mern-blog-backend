import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 1000,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// запретить пользователю оставлять несколько отзывов на один пост
// ReviewSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
