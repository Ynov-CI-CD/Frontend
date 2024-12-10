export interface UserDto extends Omit<CreateUserDto, 'password' | 'repeatPassword'> {
  id: number;
  role: UserRole;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  city: string;
  postalCode: string;
  password: string;
  repeatPassword: string;
}

export type UserRole = 'user' | 'admin';
