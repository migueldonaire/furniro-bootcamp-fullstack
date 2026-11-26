import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "El email no es valido" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  password!: string;
}
