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
    <h2>Введите длительность</h2>
    <input [(ngModel)]="duration" placeholder="например, 30m или 2h" />
    <button (click)="submit()">Заморозить</button>
    `
})
export class FreezeDialogComponent {
    duration: string = '';

    constructor(private dialogRef: MatDialogRef<FreezeDialogComponent>) {}

    submit() {
        this.dialogRef.close(this.duration);
    }
}