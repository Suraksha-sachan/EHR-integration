import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export abstract class BaseService {
  protected _getBadRequestError(message: string) {
    throw new BadRequestException({ message });
  }
  protected _getForbiddenError(message: string) {
    throw new ForbiddenException({ message });
  }
  protected _getInternalServerError(message: string) {
    throw new InternalServerErrorException({ message });
  }
  protected _getNotFoundError(message: string) {
    throw new NotFoundException({ message });
  }
  protected _getUnauthorizedError(message: string) {
    throw new UnauthorizedException({ message });
  }
  protected _apiResponse(data: any) {
    const response = data,
      object = { data: response };
    return object;
  }
}
