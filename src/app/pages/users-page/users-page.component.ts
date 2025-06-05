import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminUser } from 'src/app/data/intefaces/adminUser.interface';
import { AdminService } from 'src/app/data/services/admin.service';
import { ProfileService } from 'src/app/data/services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FreezeDialogComponent } from './freeze-dialog/freeze-dialog.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit {

  users: AdminUser[] = [];
  now: Date = new Date();
  currentUserRole: string = ' ';

  constructor(
    private adminService: AdminService,
    private profileService: ProfileService,
    private dialog: MatDialog,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.profileService.getMe().subscribe((user) => {
      this.currentUserRole = user.role;
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe((data) => {
      this.users = data;
    })
  }

  isFrozen(user: AdminUser): boolean {
    return !!user.frozenUntil && new Date(user.frozenUntil) > this.now;
  }

  openFreezeDialog(user: AdminUser): void {
    const dialogRef = this.dialog.open(FreezeDialogComponent, { width: '300px'})

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const durationMs = this.parseDuration(result);
        if (durationMs) {
          const frozenUntil = new Date(Date.now() + durationMs);
          this.adminService.freezeUser(user._id, frozenUntil).subscribe(() => this.loadUsers());
        } else {
          alert('Неверный формат времени. Используйте m, h или d.');
        }
      }
    });
  }

  parseDuration(value: string): number | null {
    const match = value.match(/^(\d+)([mhd])$/);
    if (!match) return null;
    const amount = parseInt(match[1], 10);
    switch (match[2]) {
      case 'm': return amount * 60000;
      case 'h': return amount * 3600000;
      case 'd': return amount * 86400000;
      default: return null;
    }
  }

  toggleBan(user: AdminUser): void {
    (user.isBanned
      ? this.adminService.unbanUser(user._id)
      : this.adminService.banUser(user._id)
    ).subscribe(() => this.loadUsers());
  }

  unfreezeUser(user: AdminUser): void {
    this.adminService.unfreezeUser(user._id).subscribe(() => this.loadUsers());
  }

  goToProfile(user: AdminUser): void {
    this.router.navigate(['/profile/', user._id]);
  }

  isOnline(user: AdminUser): boolean {
    return user.isActive;
  }
}
