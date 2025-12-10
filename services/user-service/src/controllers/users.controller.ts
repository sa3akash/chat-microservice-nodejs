import { userService } from '@/services/user.service';
import {
  createUserSchema,
  SearchUsersQuery,
  searchUsersQuerySchema,
  userIdParamsSchema,
  Validate,
} from '@chat/common';
import type { Request, Response } from 'express';

export class UsersController {
  public async getAllUsers(_req: Request, res: Response) {
    const users = await userService.getAllUsers();

    res.status(200).json(users);
  }

  @Validate({
    query: searchUsersQuerySchema,
  })
  public async searchUsers(req: Request, res: Response) {
    const { query, limit, exclude } = req.query as unknown as SearchUsersQuery;
    const user = await userService.searchUsers({
      query,
      limit,
      excludeIds: exclude,
    });

    res.status(200).json(user);
  }

  @Validate({
    params: userIdParamsSchema,
  })
  public async getUserById(req: Request, res: Response) {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json(user);
  }

  @Validate({
    body: createUserSchema,
  })
  public async createUser(req: Request, res: Response) {
    const user = await userService.createUser(req.body);

    res.status(201).json(user);
  }
}
