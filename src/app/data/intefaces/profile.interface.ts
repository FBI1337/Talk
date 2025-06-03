export interface Profile {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    isBanned: string,
    avatarUrl: string | null,
    description: string,
    stack: string[],
    city: string,
    isActive: boolean,
    subscribersAmount: number,
}
        