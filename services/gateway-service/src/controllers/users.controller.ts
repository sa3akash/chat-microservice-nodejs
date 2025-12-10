import { auth } from '@/decorators';
import { UserProxyService } from '@/services/user-proxy.service';
import type { SearchUsersQuery } from '@chat/common';
import type { Request, Response } from 'express';

const userProxyService = new UserProxyService();

export class UsersController {
  @auth()
  public async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const response = await userProxyService.getUserById(id);
    res.status(200).json(response);
  }

  @auth()
  public async getAllUsers(_req: Request, res: Response) {
    const response = await userProxyService.getAllUsers();
    res.status(200).json(response);
  }

  @auth()
  public async createUser(req: Request, res: Response) {
    const response = await userProxyService.createUser(req.body);
    res.status(201).json(response);
  }

  @auth()
  public async searchUsers(req: Request, res: Response) {
    const { query, limit, exclude } = req.query as unknown as SearchUsersQuery;
    const user = req?.user;

    const sanitizedExclude = Array.from(new Set([...exclude, user.id]));

    const response = await userProxyService.searchUsers({
      query,
      limit,
      exclude: sanitizedExclude,
    });
    res.status(200).json(response);
  }
}
