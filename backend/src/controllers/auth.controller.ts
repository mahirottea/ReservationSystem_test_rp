import { Body, Controller, Post, Delete } from '@nestjs/common';
import { AuthService } from '@/services/auth.service';
import { LoginDto } from '@/dtos/login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RememberLoginDto } from "../dtos/remember-login.dto";
import { DeleteTokenDto } from "../dtos/delete-token.dto";
import { Public } from '@/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.loginFromValidatedUser(user);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post("remember-login")
  async rememberLogin(@Body() dto: RememberLoginDto) {
    return this.authService.rememberLogin(dto);
  }

  @Public()
  @Delete("remember-token")
  async deleteToken(@Body() dto: DeleteTokenDto) {
    return this.authService.deleteRememberToken(dto);
  }
}