import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './modules/student/student.route';
import { UserRoutes } from './modules/user/user.route';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import router from './routes';
// import cookieParser  from 'cookie-parser'
const app: Application = express();

// parser

app.use(express.json());

app.use(cors({origin : ['http://localhost:5000']}));
// app.use(cookieParser())

// application routes

app.use('/api/v1/', router);

app.get('/', (req: Request, res: Response) => {
  Promise.reject();
  res.send('server is running.....!');
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;