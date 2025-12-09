import { AuthService } from '@/services/auth.services';
import { ip } from '@/utils/ip';
import { LoginInput, loginSchema, RegisterInput, registerSchema } from '@/utils/zod';
import { Validate } from '@chat/common';
import { Request, Response } from 'express';

const authService = new AuthService();

export class AuthController {
  @Validate({
    body: registerSchema,
  })
  public async register(req: Request, res: Response) {
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);
    const user = await authService.register(req.body as RegisterInput, ipAddress, userAgent);
    return res.status(201).json(user);
  }

  @Validate({
    body: loginSchema,
  })
  public async login(req: Request, res: Response) {
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);
    const user = await authService.login(req.body as LoginInput, ipAddress, userAgent);
    return res.status(200).json(user);
  }
}
