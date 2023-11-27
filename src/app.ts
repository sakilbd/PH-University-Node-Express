import express, { Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app = express();

//parser
app.use(express.json());
app.use(cors());



//api/v1/students/create-student
//application routers
app.use('/api/v1', router);
// app.use('/api/v1/users', UserRoutes);




const getAController = (req: Request, res: Response) => {
  res.send("server is working");
}
app.get('/', getAController);


//global error handler
app.use(globalErrorHandler)
app.use(notFound);

export default app;
