import { AuthProxyService } from '@/services/auth.proxy.service';
import { ip } from '@/utils/ip';
import { registerSchema, Validate } from '@chat/common';
import type { Request, Response } from 'express';

const authProxyService = new AuthProxyService();

export class AuthController {
  @Validate({
    body: registerSchema,
  })
  public async register(req: Request, res: Response) {
    const { email, password, displayName } = req.body;
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);

    const response = await authProxyService.register(
      { email, password, displayName },
      ipAddress,
      userAgent,
    );

    res.status(201).json(response);
  }
}
