import { HttpException, HttpStatus } from '@nestjs/common';
import { ChatPenality, PenalityTimeType, PenalityType } from '@prisma/client';

export class RoomPunishException extends HttpException {
  constructor(penalty: ChatPenality) {
    let msg: string;
    msg = 'Vous avez été ';
    msg += penalty.type == PenalityType.BAN ? ' banni ' : 'rendu muet ';
    msg += ' de ce salon';
    msg +=
      penalty.timetype == PenalityTimeType.PERM
        ? ' de façon permanente'
        : " Jusqu'au " + penalty.endTime.toLocaleString('fr-FR');

    super(msg, HttpStatus.FORBIDDEN);
  }
}
