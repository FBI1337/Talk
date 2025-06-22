import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'hightlight'
})

export class HightLightPipe implements PipeTransform {
    transform(content: string, search: string) {
        if (!search) return content

        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearch})`, 'gi');
        return content.replace(regex, `<span class="highlight">$1</span>`)
        
    }
}