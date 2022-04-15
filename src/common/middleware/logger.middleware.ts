import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		console.clear();
		console.log(`${req.method}\t`, req.url);
		console.log('QUERY\t', req.query);
		// console.log('HEADERS: ', req.headers);
		console.log('BODY\t', req.body);
		console.log();
		next();
	}
}
