import { InternalServerErrorException } from "@nestjs/common";

type ResponseSuccessConstructorType = {
    data?: any,
    message?: string,
    statusCode?: number
}

export class SuccessResponse<T> {
  data: T;
  message: string | null;
  status: number;

  constructor(responseObj: ResponseSuccessConstructorType) {
    this.data = responseObj.data;
    this.message = responseObj.message;
    this.status = responseObj.statusCode || 200;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      data: this.data
    };
  }
}

export class ServerErrorResponse extends InternalServerErrorException {
  constructor(){
    super({
      message: "Internal Server Error Occured !",
    })
  }
}