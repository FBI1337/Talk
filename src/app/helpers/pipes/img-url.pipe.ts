import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgUrl',
  standalone: true
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) {
      return null;
    }
    return  value
    ? `https://talk-backend-betatest.onrender.com/uploads/avatars/${value}`
    : '../../../assets/imgs/avatar-placeholder.png';
  }

}
