import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './modules/student/student.route';
import { UserRoutes } from './modules/user/user.route';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import router from './routes';
const app: Application = express();

// parser

app.use(express.json());

app.use(cors());


// application routes

app.use('/api/v1/', router)

app.get('/', (req: Request, res: Response) => {
  res.send('hello vai hello ki khobor apnr!');
});


app.use(globalErrorHandler);

app.use(notFound)

export default app;
