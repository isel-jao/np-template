import { BadRequestException } from '@nestjs/common';
import { compareSync, genSalt, hash } from 'bcrypt';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { uniqueId } from 'lodash';
import { sign } from 'jsonwebtoken';
import env from '@/common/env';

const isValideDate = (date) => {
  return !isNaN(Date.parse(date));
};
const reviver = (_key: unknown, value: string) => {
  if (typeof value === 'string' && isValideDate(value)) {
    return new Date(value);
  }
  return value;
};
export const safeParse = (value) => {
  try {
    const newVal = JSON.parse(value, reviver);
    console.log(newVal);
    return newVal;
  } catch (e) {
    return value;
  }
};

export async function hashPassword(password: string) {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export const convertToObject = (str) => {
  if (!str) return true;
  const arr = str.split('.');
  if (arr.length === 1) return { [arr[0]]: true };
  return { [arr[0]]: { include: convertToObject(arr.slice(1).join('.')) } };
};

export const queryToObj = (str) => {
  let include = {};
  try {
    include = JSON.parse(str);
  } catch (e) {
    include = str.split(',').reduce((acc, curr) => {
      const obj = convertToObject(curr.trim());
      return { ...acc, ...obj };
    }, {});
  }
  return include;
};

export function ConvertQueries() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    if (key == 'findAll') {
      const orignalMethod = descriptor.value;
      descriptor.value = function (params: any, ...args: any[]) {
        const { skip, take, where, orderBy, include, select } = params;
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
        if (include) {
          params.include = queryToObj(include);
        }
        if (select) params.select = queryToObj(select);
        return orignalMethod.apply(this, [params, ...args]);
      };
      return descriptor;
    }
  };
}

export const storage = diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_req, file, cb) {
    const ext = extname(file.originalname);
    cb(null, new Date().getTime() + uniqueId() + ext);
  },
});

export function generateAccessToken(user: { email: string; id: number }) {
  const { id, email } = user;

  const token = sign({ id, email }, env.JWT_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });

  return token;
}

export function generateRefreshToken(user: { email: string; id: number }) {
  const { id, email } = user;
  const token = sign({ id, email }, env.JWT_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
  return token;
}

export function comparePassword(password: string, hashedPassword: string) {
  return compareSync(password, hashedPassword);
}
