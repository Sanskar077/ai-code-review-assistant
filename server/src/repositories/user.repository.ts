import type { User } from "@prisma/client";

import { prisma } from "../database/prisma";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

/**
 * Data-access layer for the User model. Contains no business logic —
 * only Prisma queries. Services decide what to do with the results
 * (e.g. stripping the password field before returning to a controller).
 */
export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  },

  async updateById(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },
};
