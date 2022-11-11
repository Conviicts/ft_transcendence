/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PongRepository } from './pong.repository';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/entities/user.entity';
import { PongGame } from './entities/pong.entity';

@Injectable()
export class PongService {
  constructor(
    @InjectRepository(PongRepository)
    private pongRepository: PongRepository,
    private userRepository: UserRepository,
  ) {}

  getAllMaps(): object {
    const fs = require('fs');
    const files = fs.readdirSync('/upload/maps/');
    return files;
  }

  playerWin(winner: User, looser: User) {
    winner.wins = winner.wins + 1;
    looser.looses = looser.looses + 1;

    let winnerTotalWins = winner.wins - winner.looses;
    let looserTotalWins = looser.wins - looser.looses;
    if (winnerTotalWins <= 0) winnerTotalWins = 1;
    if (looserTotalWins <= 0) looserTotalWins = 1;
  }

  addGameToPlayers(userOne: User, userTwo: User, newGame: PongGame) {
    userOne.games_count += 1;
    userTwo.games_count += 1;

    if (userOne.userId === newGame.winner && userTwo.userId === newGame.looser)
      this.playerWin(userOne, userTwo);
    else this.playerWin(userTwo, userOne);
  }

  async saveGame(game: PongGame, userOne: User, userTwo: User) {
    const newGame = await this.pongRepository.createPongGame(
      game,
      userOne,
      userTwo,
    );

    if (!userOne.games) userOne.games = [];
    if (!userTwo.games) userTwo.games = [];
    userOne.games.push(newGame);
    userTwo.games.push(newGame);

    this.addGameToPlayers(userOne, userTwo, newGame);
    try {
      await this.userRepository.save(userOne);
      await this.userRepository.save(userTwo);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getUser(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { userId: id },
    });
    return user;
  }

  async getAllGames(): Promise<PongGame[]> {
    const query = await this.pongRepository.createQueryBuilder().getMany();
    return query;
  }
}
