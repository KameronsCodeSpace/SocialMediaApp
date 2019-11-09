const express = require('express');
const cors = require('cors')
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routers
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const likeRouter = require('./routes/likeRouter');

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/likes', likeRouter);
app.use('/', (req, res) => res.send('welcome to lurker'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));