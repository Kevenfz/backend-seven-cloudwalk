import { Injectable, NotFoundException } from '@nestjs/common';
import { FavoriteProductDto } from './dto/favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { Product } from './../products/entities/product.entity';
import * as usersMock from '../users/mocks/users.json';
import * as productsMock from '../products/mocks/products.json';

const favoriteMock: Favorite[] = [];

@Injectable()
export class FavoriteService {
  async favoriteProduct(dto: FavoriteProductDto): Promise<Favorite> {
    await this.verifyUserId(dto.iduser);

    const product: Product = productsMock.find(
      (product: any) => product.name === dto.idproduct,
    ) as Product;

    if (!product) {
      throw new NotFoundException(
        `Produto de nome '${dto.idproduct}' não encontrado`,
      );
    }

    const newFavorite: Favorite = {
      id: (favoriteMock.length + 1).toString(), // Simple ID generation
      ...dto,
    } as Favorite; // Cast to Favorite

    favoriteMock.push(newFavorite); // Add to mock array

    return newFavorite;
  }

  async unfavoriteProduct(id: string) {
    const index = favoriteMock.findIndex(favorite => favorite.id === id);
    const favorite = favoriteMock[index];

    if (index === -1) {
      throw new NotFoundException(`Produto de nome '${id}' não encontrado`);
    }

    return favoriteMock.splice(index, 1)[0];
  }

  async getUserFavorites(id: string): Promise<Favorite[]> {
    await this.verifyUserId(id);

    return favoriteMock.filter(favorite => favorite.iduser === id);
  }

  async getProductWhoFavorites(id: string): Promise<Favorite[]> {
    const product: Product = productsMock.find((p: any) => p.id === id) as Product;
    if (!product) {
      throw new NotFoundException(`Entrada de id '${id}' não encontrada`);
    }

    return favoriteMock.filter(favorite => favorite.idproduct === id);
  }

  async verifyUserId(id: string): Promise<void> { // Needs modification to use usersMock
    const user = usersMock.find((user: any) => user.id === id);
    if (!user) {
      throw new NotFoundException(`Entrada de id '${id}' não encontrada`);
    }
  }
}