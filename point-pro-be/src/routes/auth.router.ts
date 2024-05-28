import { Router } from 'express';
import { AuthController } from '../controllers';
import { validateMiddleware } from '../middlewares';
import { loginSchema, registerSchema } from '../validators';

const authRouter = Router();

authRouter.post('/register', validateMiddleware(registerSchema), AuthController.registerHandler);
authRouter.post('/login', validateMiddleware(loginSchema), AuthController.loginHandler);
// authRouter.post('/logout', AuthController.logoutHandler);
authRouter.post('/token', AuthController.generateTokenHandler);
authRouter.get('/user-info', AuthController.decodeTokenHandler);

export default authRouter;
