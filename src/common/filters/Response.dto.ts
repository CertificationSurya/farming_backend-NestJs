import { User } from "src/auth/dto/create-user.dto";

type ResponseSuccessConstructorType = {
    data?: object,
    message?: string,
    statusCode?: number
}

export class SuccessResponse {
  data: User | object;
  message: string | null;
  status: number;

  constructor(responseObj: ResponseSuccessConstructorType) {
    this.data = responseObj.data;
    this.message = responseObj.message;
    this.status = responseObj.statusCode || 200;
  }
}

