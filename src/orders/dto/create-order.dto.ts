import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class CreateOrderDto {
    @IsArray()
    @Type(() => Object)    
    @ApiProperty({
      description: 'detalhes do pedido',
      example: '[{ "productId":"xxxxxxxxx-xxxxxxxxx-0", "quantity": 4 }]'
    })
    details:  any[];
}