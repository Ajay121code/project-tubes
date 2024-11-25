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
    limit: '10mb',
}));

app.use(express.urlencoded({
    limit: '10mb',
    extended: true,
}));

app.use(express.static('../public'));

app.use(cookieParser());

import userRouter from './routes/user.routes.js';
app.use('/api/user', userRouter);

// app.get('/', (req, res) => {
//     res.send('Welcome to My API! 🚀');
// });
app.get('/home', (req, res) => {
    res.send('Welcome to My API! 🚀');
});
// Catch-all 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).send('404: Page Not Found');
});

export default app;