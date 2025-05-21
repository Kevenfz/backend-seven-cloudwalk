import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PriceUpdateProductDto } from './dto/priceupdate-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from 'src/auth/logged-user.decorator';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @ApiOperation({
    summary: 'Criar um produto',
  })
  @Post()
  @UseGuards(AuthGuard())
  create(
 @LoggedUser() user: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!user.roleAdmin) {
      throw new UnauthorizedException(
        `Usuário ${user.nickname} não esta cadastrado como administrador`,
      );
    }
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({
    summary: 'Mostrar todos os produtos',
  })
  @Get('all')
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({
    summary: 'Mostrar um produto por ID',
  })
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualizar um produto',
  })
  @UseGuards(AuthGuard())
  @Patch('updateProducts/:id')
  update(
 @LoggedUser() user: any,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    if (!user.roleAdmin) {
      throw new UnauthorizedException(
        `Usuário ${user.nickname} não esta cadastrado como administrador`,
      );
    }
    return this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Atualiza preços dos produtos (atualização em massa).',
  })
  @Patch('updateAll')
  @UseGuards(AuthGuard())
  @ApiBody({ type: [PriceUpdateProductDto] } )
  priceUpdate(
 @LoggedUser() user: any,
    @Body() dto: PriceUpdateProductDto[]
  ) {
    if (!user.roleAdmin) {
      throw new UnauthorizedException(
        `Usuário ${user.nickname} não esta cadastrado como administrador`,
      );
    }
    return this.productsService.priceUpdate(user.id, dto);
  }

  @UseGuards(AuthGuard())
  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Deletar um produto',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@LoggedUser() user: any, @Param('id') id: string) {
    if (!user.roleAdmin) {
      throw new UnauthorizedException(
        `Usuário ${user.nickname} não esta cadastrado como administrador`,
      );
    }
    return this.productsService.delete(id);
  }
}
