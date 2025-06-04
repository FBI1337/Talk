export interface AdminUser {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: 'user' | 'admin1' | 'admin2';
    city?: string;
    avatarUrl?: string;
    subscribersAmount: number;
    isBanned: boolean;
    isActive: boolean;
    frozenUntil: Date | null;
}