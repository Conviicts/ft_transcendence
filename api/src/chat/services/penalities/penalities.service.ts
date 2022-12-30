import { Injectable } from '@nestjs/common';
import { ChatPenality, PenalityTimeType, PenalityType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PenalitiesService {
  constructor(private prisma: PrismaService) {}

  async punishUser(
    userId: number,
    roomId: number,
    type: PenalityType,
    end_at?: Date,
  ) {
    await this.prisma.chatPenality.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        room: {
          connect: {
            id: roomId,
          },
        },
        type: type,
        timetype: end_at ? PenalityTimeType.TEMP : PenalityTimeType.PERM,
        endTime: end_at ? end_at : new Date(),
      },
    });
  }

  async getPenaltyById(id: number): Promise<ChatPenality | any> {
    return await this.prisma.chatPenality.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
        room: {
          include: {
            admins: true,
          },
        },
      },
    });
  }

  async deletePenalty(id: number) {
    if (!id) return;
    await this.prisma.chatPenality.delete({
      where: {
        id: id,
      },
    });
  }

  async getRoomPenalitiesForUser(
    userId: number,
    roomId: number,
  ): Promise<ChatPenality> {
    const penalities = await this.prisma.chatPenality.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
        OR: [
          {
            timetype: PenalityTimeType.PERM,
          },
          {
            endTime: {
              gt: new Date(),
            },
          },
        ],
      },
    });
    return penalities;
  }

  async getActivePenalities(userId: number): Promise<ChatPenality[]> {
    return await this.prisma.chatPenality.findMany({
      where: {
        id: userId,
        OR: [
          {
            endTime: null,
          },
          {
            endTime: {
              gte: new Date(),
            },
          },
        ],
      },
    });
  }
}
