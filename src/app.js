import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
));

app.use(express.json({
    limit: '50mb',
}));

app.use(express.urlencoded({
    limit: '10mb',
    extended: true,
}));

app.use(express.static('../public'));

app.use(cookieParser());

import userRouter from './routes/user.routes.js';
import videoRouter from  './routes/video.routes.js';
app.use('/api/user', userRouter);
app.use('/api/v1/video', videoRouter);

app.use((req, res) => {
    res.status(404).send('404: Page Not Found');
});

export default app;