import { Application } from '@nativescript/core';
import { Observable } from '@nativescript/core';

export class ThemeService extends Observable {
    private static instance: ThemeService;
    private currentTheme: 'light' | 'dark' = 'light';

    private constructor() {
        super();
        this.loadTheme();
    }

    static getInstance(): ThemeService {
        if (!ThemeService.instance) {
            ThemeService.instance = new ThemeService();
        }
        return ThemeService.instance;
    }

    private loadTheme() {
        // Load theme preference from storage
        const savedTheme = Application.getString('theme', 'light');
        this.setTheme(savedTheme as 'light' | 'dark');
    }

    setTheme(theme: 'light' | 'dark') {
        this.currentTheme = theme;
        Application.setString('theme', theme);
        
        const rootView = Application.getRootView();
        if (rootView) {
            rootView.className = theme === 'dark' ? 'ns-dark' : 'ns-light';
        }
        
        this.notify({ object: this, eventName: 'themeChanged', data: theme });
    }

    toggleTheme() {
        this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }

    getCurrentTheme(): 'light' | 'dark' {
        return this.currentTheme;
    }
}