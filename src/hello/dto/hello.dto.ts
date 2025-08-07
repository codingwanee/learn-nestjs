import { IsString, Length } from 'class-validator';

export class HelloDto {
  @IsString()
  @Length(1, 20)
  name: string;
}
