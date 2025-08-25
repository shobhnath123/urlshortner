import express from 'express';

const app = express();
app.use(express.json());
const PORT = process.env.PORT ?? 8000;

app.get('/', (req, res)=>{
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});