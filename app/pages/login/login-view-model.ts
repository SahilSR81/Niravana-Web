import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class LoginViewModel extends Observable {
    private authService: AuthService;
    username: string = '';
    password: string = '';

    constructor() {
        super();
        this.authService = AuthService.getInstance();
    }

    async onLogin() {
        try {
            const success = await this.authService.login(this.username, this.password);
            if (success) {
                Frame.topmost().navigate({
                    moduleName: "pages/dashboard/dashboard-page",
                    clearHistory: true
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            // Show error dialog
        }
    }

    onGoToSignup() {
        Frame.topmost().navigate({
            moduleName: "pages/signup/signup-page"
        });
    }
}