import { InternalServerErrorException } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { PongGame } from "./entities/pong.entity";

export class PongRepository extends Repository<PongGame> {
    async createPongGame(game, userOne: User, userTwo: User) {
        const newGame: PongGame = this.create();
        const it = game.players.keys();
        
        let date = new Date();
        let playerone = it.next().value;
        let playertwo = it.next().value;

        newGame.playerOne = playerone;
        newGame.playerTwo = playertwo;
        newGame.createdAt = game.startDate;
        newGame.score = game.score;
        newGame.duration = date.getTime() - game.startDate.getTime();
        newGame.users = [userOne, userTwo];
        if (game.score[0] < game.score[1]) {
            newGame.winner = playertwo;
            newGame.looser = playerone;
        } else {
            newGame.winner = playerone;
            newGame.looser = playertwo;
        }
        try {
			await this.save(newGame);
			return newGame;
		} catch (e) {
			throw new InternalServerErrorException();
		}
    }
}