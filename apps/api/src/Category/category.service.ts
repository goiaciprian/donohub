import { PrismaService } from "@/Prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryService {
    constructor (private readonly prismaService: PrismaService) {}

    async getCategories() {
        return this.prismaService.category.findMany();
    }
}