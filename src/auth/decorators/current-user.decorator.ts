import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

type UserPayload = {
  id: string;
  email: string;
  phone: string | null;
  role: string | null;
};

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload;

    if (!user) return null;

    return data ? user[data] : user;
  },
);