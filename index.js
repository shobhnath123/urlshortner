import express from 'express';
import {authenticationMiddleware} from './middleware/auth.middleware.js';
import userRouter from './router/user.router.js';

const app = express();
const PORT = process.env.PORT ?? 8001;
app.use(express.json());
app.use(authenticationMiddleware);

app.get('/', (req, res)=>{
    res.send('Hello World');
});

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});