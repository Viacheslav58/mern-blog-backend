import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // review: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Review',
        //     required: true,
        // },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);

// виртуальное поле "reviews"
PostSchema.virtual('reviews', {
    ref: 'Review', // модель, с которой связываем
    localField: '_id', // поле в Post
    foreignField: 'post', // поле в Review
});

// включаем виртуальные поля в JSON/объекты
PostSchema.set('toObject', { virtuals: true });
PostSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Post', PostSchema);
