import "express";

declare global {
  namespace Express {
    interface Request {
      /** Populated by the `authenticate` middleware after JWT verification. */
      user?: {
        id: string;
      };
    }
  }
}

export {};
