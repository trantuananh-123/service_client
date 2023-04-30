import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  username = 'username';
  message = '';
  messages: Array<any> = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    Pusher.logToConsole = true;

    const pusher = new Pusher('25291c0752d6089a660c', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('blog');
    channel.bind('message', (data: any) => {
      // this.messages.push(data);
      alert(JSON.stringify(data));
    });
  }

  change(event: any) {
    this.message = event.target.value;
  }

  submit(): void {
    this.http.post('http://localhost:8000/api/chat/messages', {
      username: this.username,
      message: this.message
    }).subscribe(() => this.message = '');
  }

}
