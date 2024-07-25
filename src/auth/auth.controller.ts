import { Controller, Get, Post } from "@nestjs/common";

@Controller('/auth')
export class AuthController {


    @Get()
    getUser() {
        return {}
    }

    @Post()
    sendOTP() {
        return {}
    }
    @Post()
    verifyOTP() {
        return {}
    }
    @Post()
    signUp() {
        return {}
    }

    @Post()
    login() {
        return {}
    }

    @Get()
    logout() {
        return {}
    }
}