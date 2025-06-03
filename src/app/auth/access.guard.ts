import { inject } from "@angular/core"
import { AuthService } from "./auth.service"
import { Router } from "@angular/router";
import { ProfileService } from "../data/services/profile.service";

export const canActivateAuth = () => {
    const isLoggedIn = inject(AuthService).isAuth;

    if (isLoggedIn) {
        return true;
    }

    return inject(Router).createUrlTree(['/login'])
}

export const canActivateRole = (roles: string[]) => {
    return () => {
        const profileService = inject(ProfileService);
        const router = inject(Router);


        const userRole = profileService.getUserRole();

        if (!roles.includes(userRole || '')) {
            return router.createUrlTree(['/']);
        }

        return true;
    }
}