import express from "express";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import errHandler from "./middlewares/errHandler.js";
// import dotenv from 'dotenv';
// dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/api', eventRoutes)

app.get('/ping', (req, res) => {
  res.json('pong')
})

app.use(errHandler)

app.use('*', (req, res) => {
    res.status(404).json('Route Not Found.')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
