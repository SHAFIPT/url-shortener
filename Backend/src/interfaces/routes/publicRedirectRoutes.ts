import { Router } from 'express';
import { urlController } from '../../config/container';

export const publicRedirectRoutes = Router();

publicRedirectRoutes.get('/:code', urlController.redirectToLongUrl);