import { Module } from "@nestjs/common";
import { OTPController } from "./otp.controller";
import { OTPService } from "./otp.service";
import { userProviders } from "../user.provider";

@Module({
    imports: [],
    controllers: [OTPController],
    providers: [OTPService, ...userProviders]
})

export class OTPModule {}