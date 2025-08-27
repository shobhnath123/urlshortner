import express from 'express';

const app = express();
import userRouter from './router/user.router.js';

app.use(express.json());
const PORT = process.env.PORT ?? 8001;

app.get('/', (req, res)=>{
    res.send('Hello World');
});

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});