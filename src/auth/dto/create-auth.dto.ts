import { IsNotEmpty, IsString } from "class-validator"

export class CreateAuthDto {

    @IsString()
    @IsNotEmpty()
    firts_name!: string
    
    @IsString()
    @IsNotEmpty()
    last_name!: string
    
    @IsString()
    @IsNotEmpty()
    username!: string

    @IsString()
    @IsNotEmpty()
    uuid!: string
}
