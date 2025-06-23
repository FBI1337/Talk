export interface Profile {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: 'user' | 'admin1' | 'admin2',
    isBanned: string,
    avatarUrl: string | null,
    description: string,
    stack: string[],
    city: string,
    isActive: boolean,
    subscribersAmount: number,
    followers: string[],
    frozenUntil: Date | null
}
        