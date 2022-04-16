import { INestApplication, Injectable, OnModuleInit, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    // prisma middleware  
    this.$use(async (params, next) => {
      console.log('prisma middleware', params);

      const { model, action, args } = params;
      if (action == 'create' || action == 'update') {
        // prervent sending  empty Object in create and update
        if (Object.keys(params.args.data).length === 0)
          throw new Error('No data provided');

        // hash password
        if (args.data && args.data.password)
          args.data.password = await bcrypt.hash(args.data.password, bcrypt.genSaltSync(10));
      }

      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
