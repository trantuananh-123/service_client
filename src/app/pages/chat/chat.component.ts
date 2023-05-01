import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Pusher from 'pusher-js';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserStorageService } from 'src/app/services/user-storage.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  username: string = '';
  user: any;
  otherUser: any;
  message: string = '';
  chatHistory: Array<any> = [];
  chatList: Array<any> = [];
  tempChatList: Array<any> = [];
  first_user_id: number = 0;
  second_user_id: number = 0;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private userStorageService: UserStorageService,
    private authService: AuthService,
    private chatService: ChatService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.username = '';
      this.message = '';
      this.user = JSON.parse(this.userStorageService.getUser()!);
      this.first_user_id = this.user.id;
      this.second_user_id = +params['id'];
      this.authService.getById(this.second_user_id).subscribe((data: any) => {
        this.otherUser = data.data;
      });

      Pusher.logToConsole = false;

      const pusher = new Pusher('9828c604c6fe5f7d1400', {
        cluster: 'ap1'
      });

      const channel = pusher.subscribe('blog');
      channel.bind(this.first_user_id + "_chat_" + this.second_user_id, (data: any) => {
        // this.messages.push(data);
        for (let i = 0; i < data.length; i++) {
          this.chatHistory.push(data[i]);
        }
        this.getChatList();
        // alert(JSON.stringify(data));
      });

      this.getChatHistory();
      this.getChatList();

    });
  }

  ngOnInit(): void {

  }

  change(event: any) {
    this.message = event.target.value;
  }

  getChatHistory() {
    this.chatService.getChatHistory({
      first_user_id: this.first_user_id,
      second_user_id: this.second_user_id,
    }).subscribe((data: any) => {
      this.chatHistory = data.data;
    })
  }

  getChatList() {
    this.chatService.getChatList(this.first_user_id).subscribe((data: any) => {
      this.chatList = data.data;
      this.tempChatList = data.data;
    })
  }

  chat(): void {
    this.chatService.chat({
      first_user_id: this.first_user_id,
      second_user_id: this.second_user_id,
      message: this.message
    }).subscribe((data: any) => {
      console.log(data);
      this.message = '';
    })
  }

  searchUser(event: any) {
    this.username = event.target.value;
    this.tempChatList = this.chatList.filter(x => x.name.toLocaleLowerCase().includes(this.username.toLocaleLowerCase()));
  }

  onEnter(): void {
    this.chatService.chat({
      first_user_id: this.first_user_id,
      second_user_id: this.second_user_id,
      message: this.message
    }).subscribe((data: any) => {
      console.log(data);
      this.message = '';
    })
  }

}
