import { AuthService } from '@/services/auth.services';
import { ip } from '@/utils/ip';
import { RegisterInput, registerSchema } from '@/utils/zod';
import { Validate } from '@chat/common';
import { Request, Response } from 'express';

export class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  @Validate({
    body: registerSchema,
  })
  public async register(req: Request, res: Response) {
    const { email, password, displayName } = req.body as RegisterInput;
    const userAgent = req.get('user-agent') || '';
    const ipAddress = ip(req);
    const user = await this.authService.register(
      { email, password, displayName },
      ipAddress,
      userAgent,
    );
    return res.status(201).json(user);
  }
}
