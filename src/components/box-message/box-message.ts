import { Message } from './../../shared/models/message.models';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'box-message',
  templateUrl: 'box-message.html',
  host:{
    '[style.justify-content]':'((sendFor) ? "flex-start" : "flex-end")',
    '[style.text-align]':'((sendFor) ? "left" : "right")'
  }
})
export class BoxMessageComponent {

  @Input() sendMessage:Message;
  @Input() sendFor:Boolean;


  constructor() {}

}
