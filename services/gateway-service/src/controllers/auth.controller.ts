import { AuthProxyService } from '@/services/auth.proxy.service';
import { ip } from '@/utils/ip';
import { loginSchema, refreshSchema, registerSchema, revokeSchema, Validate } from '@chat/common';
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

  @Validate({
    body: loginSchema,
  })
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);

    const response = await authProxyService.login({ email, password }, ipAddress, userAgent);

    res.status(200).json(response);
  }

  @Validate({
    body: refreshSchema,
  })
  public async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);

    const response = await authProxyService.refreshToken(refreshToken, ipAddress, userAgent);

    res.status(200).json(response);
  }

  @Validate({
    body: revokeSchema,
  })
  public async logout(req: Request, res: Response) {
    const { token } = req.body;
    const response = await authProxyService.logout(token);
    res.status(200).json(response);
  }

  @Validate({
    body: revokeSchema,
  })
  public async removeRefreshToken(req: Request, res: Response) {
    const { token } = req.body;

    const response = await authProxyService.removeRefreshToken(token);

    res.status(200).json(response);
  }
}
