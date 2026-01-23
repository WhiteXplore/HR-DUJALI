import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { User_Accounts } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User_Accounts)
    private readonly userRepository: Repository<User_Accounts>,
  ) {}

  async findUserByEmail(email: string): Promise<User_Accounts | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.validateUser(email, password);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      employee_id: user.employee_id,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res.json({ message: 'Login successful', role: user.role });
  }

  async logout(res: Response) {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  async getProfile(req: Request) {
    try {
      const token = req.cookies['jwt'];
      if (!token) throw new UnauthorizedException('Not authenticated');

      const decoded = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });
      if (!user) throw new UnauthorizedException('User not found');

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        employee_id: user.employee_id,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // ✅ Registration / Add User
  async register(
    email: string,
    password: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    employee_id: string,
    role: string,
    res: Response,
  ) {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      first_name,
      middle_name,
      last_name,
      employee_id,
      role: role || 'User', // default to 'User' if not provided
    });

    await this.userRepository.save(newUser);

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      first_name: newUser.first_name,
      middle_name: newUser.middle_name,
      last_name: newUser.last_name,
      employee_id: newUser.employee_id,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return res
      .status(201)
      .json({ message: 'User created successfully', role: newUser.role });
  }

  // ✅ Update User
  async updateUser(
    id: number,
    first_name: string,
    middle_name: string,
    last_name: string,
    employee_id: string,
    email: string,
    role: string,
    password?: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    user.first_name = first_name;
    user.middle_name = middle_name;
    user.last_name = last_name;
    user.employee_id = employee_id;
    user.email = email;
    user.role = role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return this.userRepository.save(user);
  }
}
