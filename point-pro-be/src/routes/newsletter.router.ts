import { Router } from 'express';
import { NewsletterController } from '../controllers';
import { validateMiddleware } from '../middlewares';
import { newsletterSchema } from '../validators/newsletter.validator';

const newsletterRouter = Router();
newsletterRouter.post('/', validateMiddleware(newsletterSchema), NewsletterController.subscribe);

export default newsletterRouter;
