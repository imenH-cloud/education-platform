import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

  
    @ApiProperty()
    email: string ;
  
    @ApiProperty()
    firstName: string ;
  
    @ApiProperty()
    lastName: string ;
  
    @ApiProperty()
    phone: string ;
  
    @ApiProperty()
    picture: string;
  
    @ApiProperty()
    address: string ;
  
    @ApiProperty()
    zipCode: string ;
  
    @ApiProperty()
    password: string ;
  
    @ApiProperty()
    saltRounds: string;
  
 
  
 
}
