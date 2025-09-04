import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const tags = await PostModel.distinct('tags'); // уникальные значения по полю tags
        res.json(tags.slice(0, 5)); // берём первые 5
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить теги',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'fullName avatarUrl' }, // авторы отзывов
                options: { sort: { createdAt: -1 } }, // сортировка отзывов
            });

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

// GET /posts?page=2&limit=5
export const getAllPag = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'fullName avatarUrl' }, // авторы отзывов
                options: { sort: { createdAt: -1 } }, // сортировка отзывов
            });

        const total = await PostModel.countDocuments();

        res.json({
            posts,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Не удалось получить статьи' });
    }
};

export const getPopular = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'fullName avatarUrl' }, // авторы отзывов
                options: { sort: { createdAt: -1 } }, // сортировка отзывов
            })
            .sort({ viewsCount: -1 }) // сортировка по убыванию
            .limit(7)
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getByTag = async (req, res) => {
    try {
        const tagName = req.params.tag; // получаем тег из параметров маршрута

        const filter = tagName ? { tags: tagName } : {}; // если тег задан — фильтруем

        const posts = await PostModel.find(filter)
            .populate('user')
            .sort({ viewsCount: -1 }) // сортировка по убыванию
            .limit(5)
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' } // или { new: true } в старых версиях
        )
            .populate('user') //?? .populate('user') - добавил
            .populate({
                path: 'reviews',
                populate: { path: 'user', select: 'fullName avatarUrl' }, // авторы отзывов
                options: { sort: { createdAt: -1 } }, // сортировка отзывов
            });

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось вернуть статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete({ _id: postId });

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.body.user,
                tags: req.body.tags.split(','),
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};
