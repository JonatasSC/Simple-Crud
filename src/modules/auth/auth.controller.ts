import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthRequest } from 'src/middleware/authentication/auth.middleware';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create/user')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createNewUser(createAuthDto);
  }

  @Post()
  auth(@Body() authenticateDto: AuthenticateDto) {
    return this.authService.authenticateUser(authenticateDto);
  }

  @Get('all/users')
  findAll(@Req() req: AuthRequest) {
    const userData = req.user;
    console.log(userData);
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete('delete/user/:id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Patch('active/user/:id')
  active(@Param('id') id: number) {
    return this.authService.active(+id);
  }
}
