import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { apiBaseUrl } from 'src/config';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class CoEditionServiceWS {
  private stompClient: Stomp.Client;

  constructor() {}

  public connect() {
    const socket = new SockJS(`${apiBaseUrl}/ws`);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/greeting', (message) => {
        const body = JSON.parse(message.body);
        console.log(body);
      });
    });
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(null);
    }
  }

  public joinChannel(channelId: string): void {
    this.stompClient.send('/app/join', {}, channelId);
  }

  public createChannel(channelId: string): void {
    this.stompClient.send('/app/create', {}, channelId);
  }

  sendMessage(message: string): void {
    this.stompClient.send('/app/hello', {}, JSON.stringify({ name: message }));
  }

  public receiveMessages(): Observable<any> {
    return new Observable((observer) => {
      this.stompClient.subscribe('/topic/messages', (message) => {
        observer.next(message);
      });
    });
  }
}
