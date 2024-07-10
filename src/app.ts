import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import entreprisesRoutes from './routes/entreprisesRoutes';
import duoRoutes from './routes/duoRoutes';
import meetingRoutes from './routes/meetingRoutes';
import sequelize from './config/database';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: ['http://localhost:3001', 'http://10.1.1.35:3001','http://10.1.1.32:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/duos', duoRoutes);
app.use('/api/entreprises', entreprisesRoutes);
app.use('/api/meetings', meetingRoutes);

const PORT = parseInt(process.env.PORT || '3000', 10);

// alter: true permet de mettre à jour la base de données en fonction des changements dans les modèles
sequelize.sync({force:true}).then(() => {
  console.log('Database synchronized!');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
