import express, { Application, Request, Response } from 'express';
import Hapi, { Request as HapiRequest, ResponseToolkit } from '@hapi/hapi';

export default interface HttpServer {
  register (method: string, url: string, callback: Function): void
  listen (port: number): void;
}

export class ExpressAdapter implements HttpServer {
  app: Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method as keyof Application](url.replace(/\{|\}/g, ""), async (req: Request, res: Response) => {      
      try {
        const output = await callback(req.params, req.body);
        res.json(output);    
      } catch (error: any) {
        res.status(422).json({ message: error.message });
      }
    });
  }
  
  listen(port: number): void {
    this.app.listen(port);
  }  
}

export class HapiAdapter implements HttpServer {
  server: Hapi.Server;

  constructor() {
    this.server = Hapi.server({
      port: 3000,
      host: 'localhost'
    });
  }
  register(method: any, url: string, callback: Function): void {
    this.server.route({
      method,
      path: url.replace(/\:/g, ""),
      handler: async (request: HapiRequest, reply: ResponseToolkit) => {
        try {
          const output = await callback(request.params, request.payload);
          return output;
        } catch (error: any) {
          return reply.response({ message: error.message }).code(422);
        }
      }
    });
  }

  listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  } 
}