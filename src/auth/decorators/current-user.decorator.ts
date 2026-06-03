import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type UserPayload = {
  id: string;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload | undefined;

    if (!user) return null;

    return data ? user[data] : user;
  },
);
