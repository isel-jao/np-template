export * from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

type PasswordOptions = {
  minLength?: number;
  maxLength?: number;
  haveUppercase?: boolean;
  haveLowercase?: boolean;
  haveNumber?: boolean;
  haveSpecialCharacter?: boolean;
};

export function IsPassword(
  options: PasswordOptions = {},
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    const minLength = options.minLength || 8;
    const maxLength = options.maxLength || 32;
    const haveUppercase = options.haveUppercase ?? true;
    const haveLowercase = options.haveLowercase ?? true;
    const haveNumber = options.haveNumber ?? true;
    const haveSpecialCharacter = options.haveSpecialCharacter;

    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `Password must be at least ${minLength} characters long and maximum ${maxLength} characters long ${
          haveUppercase ? 'and have at least one uppercase letter ' : ''
        }${haveLowercase ? 'and have at least one lowercase letter ' : ''}${
          haveNumber ? 'and have at least one number ' : ''
        }${
          haveSpecialCharacter ? 'and have at least one special character ' : ''
        }`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          if (value.length < minLength) return false;
          if (value.length > maxLength) return false;
          if (haveUppercase && !/[A-Z]/.test(value)) return false;
          if (haveLowercase && !/[a-z]/.test(value)) return false;
          if (haveNumber && !/\d/.test(value)) return false;
          if (haveSpecialCharacter && !/[!@#$%^&*(),.?":{}|<>]/.test(value))
            return false;
          return true;
        },
        name: 'isPassword',
      },
    });
  };
}
