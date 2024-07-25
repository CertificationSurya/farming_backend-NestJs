import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";


Injectable()
export class FetchUser implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // TODO: Auth validation
        const req = context.switchToHttp().getRequest();

        

        return true;
    }
}