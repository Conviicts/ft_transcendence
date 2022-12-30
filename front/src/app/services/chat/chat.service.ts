import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ChatRoom, Message, NewRoom } from 'src/app/models/chat.model';
import { API_URI } from '../config';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
    constructor(public socket: Socket,
        private http: HttpClient,
    ) { }

    sendMessage(message: Message) {
      this.socket.emit('message', message);
    }

    getMessages(): Observable<Message[]> {  
       return this.socket.fromEvent<Message[]>('messages')
    }

    getRooms(): Observable<ChatRoom[]> {
      return this.socket.fromEvent<ChatRoom[]>('rooms');
    }
    
    getPublicRooms(): Observable<ChatRoom[]> {
      return this.socket.fromEvent<ChatRoom[]>('publicRooms');
    }
    
    getDmRooms(): Observable<ChatRoom[]> {
      return  this.socket.fromEvent<ChatRoom[]>('dmRooms');
    }

    createRoom(room: NewRoom) {
      this.http.post(`${API_URI}chat/create`, room).subscribe();
    }

    editRoom(room: ChatRoom) {
      this.socket.emit('editRoom', room);
    }

    deleteRoom(room: ChatRoom) {
      this.socket.emit('deleteRoom', room.id);
    }

    subscribeRoom(room: ChatRoom, pass?: string | null) {
      let object = {
        roomId: room.id,
        password: pass,
      }
      this.socket.emit('subscribeRoom', object);
    }

    blockUser(userId: number, block: boolean)
    {
      this.socket.emit('blockUser', {block: block, userId: userId});
    }

    pardonUser(userId: number, penaltyId: number) {
      this.socket.emit('pardonUser', {userId: userId, penaltyId: penaltyId});
    }

    promoteUser(userId: number, roomId: number) {
      this.socket.emit('promoteUser', { roomId: roomId, targetId: userId });
    }
  
    demoteUser(userId: number, roomId: number) {
      this.socket.emit('demoteUser',  { roomId: roomId, targetId: userId });
    }

    needRooms() {
      this.socket.emit('needRooms');
    }

    needPublicRooms() {
      this.socket.emit('needPublicRooms');
    }

    needDmRooms() {
      this.socket.emit('needDmRooms');
    }

    joinRoom(room: ChatRoom) {
      this.socket.emit('joinRoom', room);
    }

    leaveRoom(room: ChatRoom) {
      this.socket.emit('leaveRoom', room);
    }
}