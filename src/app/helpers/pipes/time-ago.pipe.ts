import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeAgo',
    standalone: true
})

export class TimeAgoPipe implements PipeTransform {
    transform(dateString: string) {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now.getTime() - date.getTime())/ 1000);

        if (isNaN(seconds) || seconds < 0) return '';

        if (seconds < 60) return 'только что';

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} мин назад`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ч назад`;

        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} дней назад`

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} мес назад`;

        const years = Math.floor(months / 12);
        return `${years} лет назад`;
    }
}