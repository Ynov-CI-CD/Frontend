export interface UserDto extends Omit<CreateUserDto, 'password' | 'repeatPassword'> {
  _id: string;
  role: UserRole;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  city: string;
  zipCode: string;
  password: string;
  repeatPassword: string;
}

export type UserRole = 'user' | 'admin';
