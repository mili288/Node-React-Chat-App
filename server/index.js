import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import middlewares from './middleware/Register.js';
import usersRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

app.use(middlewares);

app.use('/users', usersRoutes);
app.use('/game', gameRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
