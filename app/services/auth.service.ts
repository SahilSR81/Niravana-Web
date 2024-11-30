import { Observable } from '@nativescript/core';
import { DatabaseService } from './database.service';
import * as bcrypt from 'bcryptjs';

export class AuthService extends Observable {
    private static instance: AuthService;
    private currentUser: any = null;
    private database: DatabaseService;

    private constructor() {
        super();
        this.database = new DatabaseService();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(username: string, password: string): Promise<boolean> {
        try {
            const user = await this.database.getUserByUsername(username);
            if (!user) return false;

            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                this.currentUser = user;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async register(userData: any): Promise<boolean> {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
            await this.database.createUser(userData);
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    logout() {
        this.currentUser = null;
    }

    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}