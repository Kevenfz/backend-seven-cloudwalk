import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { handleErrorConstraintUnique } from 'src/utils/handle.error.utils';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import * as ordersMock from './mocks/orders.json';

// Import mock products if needed for details, assuming details link to products
// import * as productsMock from '../products/mocks/products.json';

@Injectable()
export class OrdersService {
  findAll() {
    return ordersMock;
  }

  async findOne(_id: string) {
    const record = (ordersMock as any).find((order) => order.id === _id); // Assuming ordersMock has an 'id' field
    if (!record) {
      throw new NotFoundException(`Registro ID:${_id} não localizado.`);
    }
    return record;
  }

  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.details.length) {
      throw new BadRequestException(`Este pedido não contém itens.`);
    }

    // Simulate creating a new order
    const newOrder = {
      id: (ordersMock as any[]).length + 1, // Simple ID generation
      userId: userId,
      details: dto.details, // Include the details directly
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (ordersMock as any[]).push(newOrder); // Add to the mock array
    return newOrder;
  }

  async update(_id: string, dto: UpdateOrderDto) {
    const index = (ordersMock as any[]).findIndex((order) => order.id === _id);

    if (index === -1) {
      throw new NotFoundException(`Registro ID:'${_id}' não localizado.`);
    }

    if (dto.details && !dto.details.length) {
      throw new BadRequestException(`Este pedido não contém itens.`);
    }

    // Get the existing record to merge updates
    const record = (ordersMock as any[])[index];

    // Update the order data, including details
    (ordersMock as any[])[index] = { ...record, ...dto, updatedAt: new Date() };

    // Return the updated order
    return (ordersMock as any[])[index];
  }

  async delete(_id: string) {
    const index = (ordersMock as any[]).findIndex((order) => order.id === _id);
    if (index === -1) {
      throw new NotFoundException(
        `Não foi possível deletar o registro ID:${_id}`,
      );
    }
    return (ordersMock as any[]).splice(index, 1)[0]; // Remove and return the deleted order
  }
}