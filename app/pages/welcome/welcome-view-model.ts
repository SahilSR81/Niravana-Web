import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';

export class WelcomeViewModel extends Observable {
    constructor() {
        super();
    }

    onGetStarted() {
        Frame.topmost().navigate({
            moduleName: "pages/signup/signup-page",
            clearHistory: true
        });
    }

    onLogin() {
        Frame.topmost().navigate({
            moduleName: "pages/login/login-page",
            clearHistory: true
        });
    }
}