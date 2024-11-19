export interface UserDto extends CreateUserDto {
  id: number;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  city: string;
  postalCode: string;
}
