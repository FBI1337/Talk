import { Component, Input } from '@angular/core';
import { TimeAgoPipe } from 'src/app/helpers/pipes/time-ago.pipe';

@Component({
  selector: 'app-comment',
  imports: [ TimeAgoPipe ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment!: any;
}
