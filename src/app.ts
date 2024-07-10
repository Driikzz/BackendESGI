import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import entreprisesRoutes from './routes/entreprisesRoutes';
import duoRoutes from './routes/duoRoutes';
import meetingRoutes from './routes/meetingRoutes';
import alertesRoutes from './routes/alertesRoutes';
import exportRoutes from './routes/exportRoutes'; // Assurez-vous d'importer le fichier de route d'exportation
import sequelize from './config/database';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/duos', duoRoutes);
app.use('/api/entreprises', entreprisesRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/alertes', alertesRoutes);
app.use('/api/export', exportRoutes); // Assurez-vous que la route d'exportation est enregistrée

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized!');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
