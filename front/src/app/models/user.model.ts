export interface IUser {
    id?:                number;
    state?:             string;
    email?:             string;
    intra_name?:        string;
    avatar?:            string;
    intra_id?:          number;
    username?:          string;
    description?:       string;
    createdAt?:         Date;
    TFAEnabled?:        boolean;
    friendOf?:          IUser[];
    friends?:           IUser[];
    leaderboard_pos?:   number;
    blockedBy?:         IUser[];
    blockedUsers?:      IUser[];
    score?:             number;
    _count?: {
       games_win: number,
       games_lose: number,
       games: number 
      };
    games?:             any[];
}

export class User {
    id!:               number;
    state?:            string; 
    email?:            string;
    intra_name?:       string;
    avatar!:           string;
    intra_id?:         number; 
    username!:         string;
    elo?:              number;
    staff?:            boolean;
    createdat?:        Date;
    blockedUsers?:     IUser[]; 
    
    constructor(id: number, username: string, avatar: string) {
        this.id = id;
        this.username = username;
        this.avatar = avatar;
    }
}

export interface TFASecret {
    secret?:        string;
    otp_url?:       string;
    qrcode?:        string;
}