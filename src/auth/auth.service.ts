import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { dbModels } from 'src/constants';

import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { SuccessResponse } from 'src/common/filters/Response.dto';

Injectable();
export class AuthService {
  constructor(@Inject(dbModels.User) private userModel: Model<User>) {}

  getUser(req: Request) {
    // @ts-ignore
    const {userData} = req

    return new SuccessResponse({
      data: userData,
      message: "User Authenticated Successfully",
    })
  }

  async signUp(form: User) {
    const {
      username,
      email,
      password,
      phoneNumber,
      type,
      description,
      location,
      gender,
    } = form;

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const newUser = await this.userModel.create({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        type,
        gender,
        location,
        description,
      });
      await newUser.save();

      // console.log(newUser, "signUp")
      delete form.password;

      // console.log({userId: newUser._id, profilePicId: newUser.profilePicId, ...form}, "signUp")
      return {userId: newUser._id, ...form};

    } catch (error) {
      console.log(error);
      throw new BadRequestException("Couldn't SignUp!")

    }
  }

  async login(userEmail: string, userPassword: string) {
		try {
			const dbUser = await this.userModel.findOne({email: userEmail});
			if (!dbUser) {
        return new BadRequestException("Invalid credentials provided")
			}

			// Check password
			const isValidPassword = await bcrypt.compare(userPassword, dbUser.password);
			if (!isValidPassword) {
				return new BadRequestException("Invalid credentials provided");
			}

      const {_id: userId, username, profilePicId, email, phoneNumber, type, location, description, gender} = dbUser;

      return { userId, username, profilePicId, email, phoneNumber, type, location, description, gender };
    } catch(err){
      throw new InternalServerErrorException("Internal Server Error Occured");
    }

  }

  logout() {
    return true;
  }
}
