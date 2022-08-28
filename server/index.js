import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import AuthRoute from './routes/AuthRoute.js';
import UserRoute from './routes/UserRoute.js';
import ChatRoute from './routes/ChatRoute.js';
import UploadRoute from './routes/UploadRoute.js';
import MessageRoute from './routes/MessageRoute.js';

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use(express.static('public'));
app.use('/images', express.static('images'));

dotenv.config();

const PORT = process.env.PORT;
const CONNECTION =process.env.MONGODB_CONNECTION;

mongoose
	.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}.`)))
	.catch((err) => console.log(`${err}\nFailed to connect to MongoDB.`));

app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)