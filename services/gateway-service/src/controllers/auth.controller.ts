import { AuthProxyService } from '@/services/auth.proxy.service';
import { ip } from '@/utils/ip';
import type { Request, Response } from 'express';

const authProxyService = new AuthProxyService();

export class AuthController {
  public async register(req: Request, res: Response) {
    const data = req.body;
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);

    const response = await authProxyService.register(data, ipAddress, userAgent);

    res.status(201).json(response);
  }

  public async login(req: Request, res: Response) {
    const data = req.body;
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);

    const response = await authProxyService.login(data, ipAddress, userAgent);

    res.status(200).json(response);
  }

  public async refreshToken(req: Request, res: Response) {
    const data = req.body;
    const userAgent = req.headers['user-agent'] as string;
    const ipAddress = ip(req);

    const response = await authProxyService.refreshToken(data, ipAddress, userAgent);
    res.status(200).json(response);
  }

  public async logout(req: Request, res: Response) {
    const data = req.body;
    const response = await authProxyService.logout(data);
    res.status(200).json(response);
  }

  public async removeRefreshToken(req: Request, res: Response) {
    const data = req.body;
    const response = await authProxyService.removeRefreshToken(data);
    res.status(200).json(response);
  }
}
