import { AuthService } from '@/services/auth.services';
import { ip } from '@/utils/ip';
import {
  type LoginInput,
  loginSchema,
  RefreshInput,
  refreshSchema,
  type RegisterInput,
  registerSchema,
  RevokeInput,
  revokeSchema,
  Validate,
} from '@chat/common';
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

  @Validate({
    body: refreshSchema,
  })
  public async refreshToken(req: Request, res: Response) {
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);
    const { refreshToken } = req.body as RefreshInput;
    const tokens = await authService.refreshTokens(refreshToken, ipAddress, userAgent);
    return res.status(200).json(tokens);
  }

  @Validate({
    body: revokeSchema,
  })
  public async logout(req: Request, res: Response) {
    const { token } = req.body as RevokeInput;
    await authService.logout(token);
    return res.status(200).json({
      message: 'Logged out successfully',
    });
  }

  @Validate({
    body: revokeSchema,
  })
  public async removeRefreshToken(req: Request, res: Response) {
    const { token } = req.body as RevokeInput;
    await authService.logout(token);
    return res.status(200).json({
      message: 'Removed successfully',
    });
  }
}
