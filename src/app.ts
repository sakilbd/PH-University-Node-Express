import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { StudentRouters } from './app/modules/student/student.route';
import { UserRoutes } from './app/modules/users/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
const app = express();

//parser
app.use(express.json());
app.use(cors());



//api/v1/students/create-student
//application routers
app.use('/api/v1/students', StudentRouters);
app.use('/api/v1/users', UserRoutes);




const getAController = (req: Request, res: Response) => {
  res.send("server is working");
}
app.get('/', getAController);


//global error handler
app.use(globalErrorHandler)
app.use(notFound);

export default app;
