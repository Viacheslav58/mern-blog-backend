import express from 'express';
import multer from 'multer';
import cors from 'cors';

import fs from 'fs';
import path from 'path';

import mongoose from 'mongoose';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
    reviewCreateValidation,
} from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

import {
    UserController,
    PostController,
    ReviewController,
} from './controllers/index.js';

mongoose
    .connect(
        'mongodb+srv://bvaabeketov:QMYsZyTCBD0KPLNm@cluster0.rltpgi4.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => {
        console.log('DB ok');
    })
    .catch((err) => {
        console.log('DB error', err);
    });

const app = express();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post(
    '/auth/login',
    loginValidation,
    handleValidationErrors,
    UserController.login
);
app.post(
    '/auth/register',
    registerValidation,
    handleValidationErrors,
    UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.delete('/upload/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(process.cwd(), 'uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.json({ success: true });
        } else {
            return res.status(404).json({ message: 'Файл не найден' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при удалении файла' });
    }
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/pag', PostController.getAllPaginated);

app.get('/posts/popular', PostController.getPopular);
app.get('/posts/popular/pag', PostController.getPopularPaginated);

app.get('/posts/tag/:tag', PostController.getByTag);

app.get('/posts/tags', PostController.getLastTags); //??

app.get('/posts/:id', PostController.getOne);
app.post(
    '/posts',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update
);

//reviews
app.get('/reviews', ReviewController.getLastReviews);
app.post(
    '/reviews/:postid',
    checkAuth,
    reviewCreateValidation,
    handleValidationErrors,
    ReviewController.create
);
app.delete('/reviews/post/:id', checkAuth, ReviewController.removeByPost);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});
