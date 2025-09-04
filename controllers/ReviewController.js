import ReviewModel from '../models/Review.js';

// export const getLastTags = async (req, res) => {
//     try {
//         const posts = await PostModel.find().limit(5).exec();

//         const tags = posts
//             .map((obj) => obj.tags)
//             .flat()
//             .slice(0, 5);

//         res.json(tags);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось получить статьи',
//         });
//     }
// };

export const getLastReviews = async (req, res) => {
    try {
        const reviews = await ReviewModel.find()
            .populate('user')
            .limit(7)
            .exec();

        res.json(reviews);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить отзывы',
        });
    }
};

// export const getPopular = async (req, res) => {
//     try {
//         const posts = await PostModel.find()
//             .populate('user')
//             .sort({ viewsCount: -1 }) // сортировка по убыванию
//             .limit(5)
//             .exec();

//         res.json(posts);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось получить статьи',
//         });
//     }
// };

// export const getByTag = async (req, res) => {
//     try {
//         const tagName = req.params.tag; // получаем тег из параметров маршрута

//         const filter = tagName ? { tags: tagName } : {}; // если тег задан — фильтруем

//         const posts = await PostModel.find(filter)
//             .populate('user')
//             .sort({ viewsCount: -1 }) // сортировка по убыванию
//             .limit(5)
//             .exec();

//         res.json(posts);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось получить статьи',
//         });
//     }
// };

// export const getOne = async (req, res) => {
//     try {
//         const postId = req.params.id;

//         const doc = await PostModel.findOneAndUpdate(
//             { _id: postId },
//             { $inc: { viewsCount: 1 } },
//             { returnDocument: 'after' } // или { new: true } в старых версиях
//         ).populate('user'); //?? .populate('user') - добавил

//         if (!doc) {
//             return res.status(404).json({
//                 message: 'Статья не найдена',
//             });
//         }

//         res.json(doc);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось вернуть статью',
//         });
//     }
// };

export const removeByPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const result = await ReviewModel.deleteMany({ post: postId });

        res.json({
            success: true,
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось удалить отзывы',
        });
    }
};

export const create = async (req, res) => {
    try {
        const postId = req.params.postid;

        const doc = new ReviewModel({
            text: req.body.text,
            user: req.userId,
            post: postId,
        });

        const review = await doc.save();

        res.json(review);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать отзыв',
        });
    }
};

// export const update = async (req, res) => {
//     try {
//         const postId = req.params.id;

//         await PostModel.updateOne(
//             {
//                 _id: postId,
//             },
//             {
//                 title: req.body.title,
//                 text: req.body.text,
//                 imageUrl: req.body.imageUrl,
//                 user: req.body.user,
//                 tags: req.body.tags.split(','),
//             }
//         );

//         res.json({
//             success: true,
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось обновить статью',
//         });
//     }
// };
