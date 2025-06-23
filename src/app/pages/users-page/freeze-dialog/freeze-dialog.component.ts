import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";

@Component({
    standalone: true,
    selector: 'app-freeze-dialog',
    imports: [
        FormsModule
    ],
    template: `

    <div class="dialog">
        <h2 class="regular-bold mb16">Введите длительность</h2>
        <input class="d-input mb16 subtitle"[(ngModel)]="duration" placeholder="например, 30m или 2h" />
        <button class="d-btn text-buttons mb8" (click)="submit()">Заморозить</button>
    </div>
    `
})
export class FreezeDialogComponent {
    duration: string = '';

    constructor(private dialogRef: MatDialogRef<FreezeDialogComponent>) {}

    submit() {
        this.dialogRef.close(this.duration);
    }
}