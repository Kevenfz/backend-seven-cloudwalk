import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { LoggedUser } from 'src/auth/logged-user.decorator';

@ApiTags('orders')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Listar todos pedidos',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('find/:id')
  @ApiOperation({
    summary: 'Listar um pedido',
  })
  findOne(@LoggedUser() user: any, @Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Criar pedido',
  }) // Removendo tipo Users do @LoggedUser, pois não está mais vindo do Prisma
  create(@LoggedUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(user.id, createOrderDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Alterar um pedido',
  })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Deletar um pedido',
  })
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
