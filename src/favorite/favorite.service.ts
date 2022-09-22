import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { FavoriteProductDto } from './dto/favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  favoriteProduct(dto: FavoriteProductDto): Promise<Favorite> {
    return this.prisma.favorite.create({ data: dto });
  }
}
