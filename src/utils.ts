import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllQuery {
  @ApiPropertyOptional()
  skip?: number;
  @ApiPropertyOptional()
  take?: number;
  @ApiPropertyOptional()
  search?: string;
  @ApiPropertyOptional()
  orderBy?: string;
  where?: string;
}

export function FindAllOptions({ searchFields }: { searchFields?: string[] }) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    if (key == 'findAll') {
      const orignalMethod = descriptor.value;
      descriptor.value = function (params: any) {
        const { skip, take, search, where, orderBy, ...unhandeld } = params;
        if (Object.keys(unhandeld).length > 0)
          throw new BadRequestException(
            'Unhandled parameters: ' + Object.keys(unhandeld).join(', '),
          );
        if (skip && !skip.match(/^\d+$/))
          throw new BadRequestException('skip must be an integer');
        if (take && !take.match(/^\d+$/))
          throw new BadRequestException('take must be an integer');
        params.skip = parseInt(skip || '0');
        params.take = parseInt(take || '20');
        try {
          params.where = JSON.parse(where || '{}');
        } catch (e) {
          throw new BadRequestException('where must be valid JSON');
        }
        try {
          params.orderBy = JSON.parse(orderBy || '{}');
        } catch (e) {
          throw new BadRequestException('orderBy must be valid JSON');
        }
        // uncomment the line below if soft delete is implemented
        // params.where.deletedAt = 'null';
        if (searchFields && searchFields.length > 0 && search) {
          params.where['OR'] = searchFields.map((field) => ({
            [field]: { contains: search, mode: 'insensitive' },
          }));
        }
        delete params.search;
        return orignalMethod.apply(this, [params]);
      };
      return descriptor;
    }
  };
}

const removeKeys = (obj: any, keys: string[]) => {
  keys.forEach((key) => {
    delete obj[key];
  });
};

const removeUnwantedColumns = (
  result: any,
  keys: string[] = ['password', 'deletedAt'],
) => {
  Object.keys(result).forEach((key) => {
    if (Array.isArray(result[key])) {
      result[key].forEach((el) => {
        removeUnwantedColumns(el, keys);
      });
    } else if (typeof result[key] === 'object' && result[key] !== null)
      removeUnwantedColumns(result[key], keys);
  });
  removeKeys(result, keys);
};

export function HandleRequestErrors() {
  return function (target: any, key: string, ds: PropertyDescriptor) {
    const originalMethod = ds.value;

    ds.value = async function (...args: any[]) {
      try {
        if (key == 'update' || key == 'create') {
          const { id, deletedAt, updatedAt, createdAt } =
            key == 'update' ? args[1] : args[0];
          if (id || deletedAt || updatedAt || createdAt)
            throw new BadRequestException(
              'id, deletedAt, updatedAt, createdAt are not allowed in POST or PATCH requests',
            );
        }
        const result = await originalMethod.apply(this, args);
        if (!result) throw new NotFoundException();
        removeUnwantedColumns(result);
        return result;
      } catch (e) {
        console.log(`handleRequestError: ${e}`);
        if (e.message === 'Not Found' || e.code === 'P2025')
          throw new NotFoundException();
        if (e.message === 'Error') throw new BadRequestException(e);
        if (e.code === 'P2002')
          throw new ConflictException(
            e.meta.target.filter((el) => el !== 'deleted_at'),
          );
        if (e.code === 'P2003')
          throw new NotFoundException(
            `Foreign key constraint failed on the field: ${e.meta.field_name}`,
          );
        // if (e.code && e.code.startsWith('P20'))
        throw new BadRequestException(`${e}`);
        // throw new Error(e);
      }
    };
    return ds;
  };
}
export function IsPhoneNumber() {
  return function (target: any, propertyKey: string) {
    let value: string;
    const getter = function () {
      // do something
      return value;
    };
    const setter = function (newVal: string) {
      try {
        const valid = newVal.match(/^\+?[0-9]{10,15}$/);
        if (!valid) throw new Error();
      } catch (e) {
        throw new BadRequestException(
          `${propertyKey} must be a valid phone number`,
        );
      }
      value = newVal;
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}
export function IsTime() {
  return function (target: any, propertyKey: string) {
    let value: string;
    const getter = function () {
      // do something
      return value;
    };
    const setter = function (newVal: string) {
      try {
        const valid = newVal.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
        if (!valid) throw new Error();
      } catch (e) {
        throw new BadRequestException(`${propertyKey} must be in HH:mm format`);
      }
      value = newVal;
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}

export function IsPassword(limit?: number) {
  return function (target: any, propertyKey: string) {
    let value: string;
    const getter = function () {
      // do something
      return value;
    };
    const setter = function (newVal: string) {
      if (limit && newVal.length < limit)
        throw new BadRequestException(
          `${propertyKey} must be at least ${limit} characters long`,
        );
      if (
        !newVal.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/,
        )
      )
        throw new BadRequestException(
          `"${propertyKey}" must contain at least one lowercase letter, one uppercase letter, one number and one special character`,
        );
      value = newVal;
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}

export function CheckToken() {
  return function (target: any, key: string, ds: PropertyDescriptor) {
    const originalMethod = ds.value;

    ds.value = async function (...args: any[]) {
      const token = args[0].split(' ')[1];
      const is_valide = await this.cacheManager.get(token);
      if (is_valide == null) throw new UnauthorizedException();
      const result = await originalMethod.apply(this, args);
      return result;
    };
    return ds;
  };
}
