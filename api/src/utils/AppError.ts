import { AppErrorCode } from '../constants/appErrorCode';
import { HttpStatusCode } from '../constants/httpCodes';

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}
