import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class SignupViewModel extends Observable {
    private authService: AuthService;
    
    username: string = '';
    password: string = '';
    name: string = '';
    birthDate: Date = new Date();
    age: number = 0;
    occupation: string = '';
    hobbies: string = '';
    relationshipOptions = ['Single', 'In a Relationship', 'Married', 'Prefer not to say'];
    selectedRelationshipIndex: number = 0;

    constructor() {
        super();
        this.authService = AuthService.getInstance();
        this.calculateAge();
    }

    get showRelationshipStatus(): boolean {
        return this.age >= 18;
    }

    private calculateAge() {
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        this.age = today.getFullYear() - birthDate.getFullYear();
    }

    async onSignUp() {
        try {
            const success = await this.authService.register({
                username: this.username,
                password: this.password,
                name: this.name,
                birthDate: this.birthDate,
                age: this.age,
                relationshipStatus: this.showRelationshipStatus ? 
                    this.relationshipOptions[this.selectedRelationshipIndex] : null,
                occupation: this.occupation,
                hobbies: this.hobbies
            });

            if (success) {
                Frame.topmost().navigate({
                    moduleName: "pages/dashboard/dashboard-page",
                    clearHistory: true
                });
            }
        } catch (error) {
            console.error('Signup error:', error);
            // Show error dialog
        }
    }

    onGoToLogin() {
        Frame.topmost().navigate({
            moduleName: "pages/login/login-page"
        });
    }
}