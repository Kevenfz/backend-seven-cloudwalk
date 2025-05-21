import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { handleErrorConstraintUnique } from 'src/utils/handle.error.utils';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { LoadExcelData } from 'src/utils/products-excel.utils';
import { PriceUpdateProductDto } from './dto/priceupdate-product.dto';
import * as productsMock from './mocks/products.json';

@Injectable()
export class ProductService {
  constructor() {}

  async findAll(): Promise<Product[]> {
    return productsMock as any;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = { id: ((productsMock as any[]).length + 1).toString(), ...createProductDto };
      (productsMock as any[]).push(newProduct);
      return newProduct as Product;
    } catch (error) {
      return handleErrorConstraintUnique(error);
    }
  }

  async verifyingTheProducts(id: string): Promise<Product> {
    const products: Product = (productsMock as any[]).find(product => product.id === id) as Product;
    if (!products) {
      throw new NotFoundException(`ID '${id}' não encontrado`);
    }
    return products as Product;
  }

  findOne(id: string): Promise<Product> {
    return this.verifyingTheProducts(id);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | void> {
    await this.verifyingTheProducts(id);
    const index = (productsMock as any[]).findIndex(product => product.id === id);
    if (index !== -1) {
      (productsMock as any[])[index] = { ...(productsMock as any[])[index], ...updateProductDto };
      return (productsMock as any[])[index] as Product;
    }
  }


  async priceUpdate(userId: string, dto: PriceUpdateProductDto[] ) {
    let Id = userId;
    let date = new Date();
    let response = [];
    let excelProducts = dto;

    // carrega arquivo excel de produtos e descontos
    //let buffer = ( await LoadExcelData() ) as PriceUpdateProductDto[];

    // Simula a leitura dos dados de atualização de preço (dto)
    const updatesDto = dto;

    // Iterar sobre o array mockado de produtos
    const productsOrigin = productsMock;

    // localiza atualização de preço para o produto no DTO
    function findUpdateProduct(id: string) {
      return updatesDto.find((prod: any) => prod['Codigo'] == id);
    }


    //console.log( 'excelProducts:', productsOrigin.length);

    // armazena as operações de alteração de preco em um array
    (productsOrigin as any[]).map((p: any) => {
      // calcula desconto
      let excelProduct = findUpdateProduct(p.id);
      if (excelProduct) {
        let newPrice = p.price;
        if (excelProduct['Percentual']) {
           newPrice = p.price - (p.price * excelProduct['Percentual']) / 100;
        } else if ( excelProduct['Acrescimo'] ) {
 newPrice = p.price + (p.price * Number(excelProduct['Acrescimo'])) / 100;
        }

        // Atualiza o objeto do produto no array mockado
       p.price = newPrice;

        // armazena dados dos produtos para a resposta
        response.push({ id: p.id, price: p.price, newPrice: newPrice });
      }
    });

    try {
      // await this.prisma.$transaction(updates); // Removido

      return { user: Id, date: date, products: response };
    } catch (error) {
      console.log('error:', error);

      return handleErrorConstraintUnique(error);
    }
  }

  async delete(id: string) {
    await this.verifyingTheProducts(id);

    const index = (productsMock as any[]).findIndex(product => product.id === id);
    return (productsMock as any[]).splice(index, 1)[0];
  }
}