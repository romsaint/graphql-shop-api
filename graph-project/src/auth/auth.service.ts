import { BadGatewayException, BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ApolloError, Config } from 'apollo-server';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './types/reg/createUser.dto';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs'
import { ReturnReg } from './types/reg/registration.type';
import { User } from 'src/user/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { ReturnLogin } from './types/login/login.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaClient: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) { }

    async registration(createUserDto: CreateUserDto): Promise<ReturnReg> {
        try{
            const isUserExists = await this.prismaClient.users.findFirst({ where: { email: createUserDto.email } })

            if (isUserExists) {
                throw new ApolloError('User already exists')
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
            const { password, ...data } = createUserDto
    
            const created = await this.prismaClient.users.create({ data: { ...data, password: hashedPassword, role: "USER" } })
            const jwtData = { ...data, id: created.id }
    
            const token = this.jwtService.sign(jwtData, { secret: this.config.get('ACCESS_TOKEN_SECRET') })
    
            return plainToClass(ReturnReg, { token, ...jwtData })
        }catch(e){
            throw new HttpException(e.message, 500)
        }
    }

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.prismaClient.users.findFirst({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }
    // { email: 'roma.ggg.20@list.ru', name: 'Jod', role: 'SELLER', id: 5 }
    async login(user: Omit<User, 'password'>): Promise<ReturnLogin> {
        const payload = { email: user.email, name: user.name, role: user.role, id: user.id };

        return { token: this.jwtService.sign(payload, { secret: this.config.get('ACCESS_TOKEN_SECRET') }), ...payload};
    }
}
