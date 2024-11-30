import { Observable } from '@nativescript/core';
import { format } from 'date-fns';
import { MoodService } from '../../services/mood.service';
import { AuthService } from '../../services/auth.service';

export class DashboardViewModel extends Observable {
    private moodService: MoodService;
    private authService: AuthService;

    constructor() {
        super();
        this.moodService = new MoodService();
        this.authService = AuthService.getInstance();
        this.initializeData();
    }

    private async initializeData() {
        const user = this.authService.getCurrentUser();
        const currentHour = new Date().getHours();
        
        this.set('greeting', this.getGreeting(currentHour, user.name));
        this.set('date', format(new Date(), 'EEEE, MMMM do'));
        
        await this.loadMoodHistory();
    }

    private getGreeting(hour: number, name: string): string {
        if (hour < 12) return `Good morning, ${name}`;
        if (hour < 17) return `Good afternoon, ${name}`;
        return `Good evening, ${name}`;
    }

    private async loadMoodHistory() {
        const user = this.authService.getCurrentUser();
        const moodHistory = await this.moodService.getWeeklyMood(user.id);
        this.set('moodHistory', moodHistory);
    }

    async onMoodSelect(args) {
        const mood = args.object.mood;
        const user = this.authService.getCurrentUser();
        await this.moodService.recordMood(user.id, mood);
        await this.loadMoodHistory();
    }

    onJournal() {
        // Navigate to journal page
    }

    onMeditation() {
        // Navigate to meditation page
    }

    onExercises() {
        // Navigate to exercises page
    }

    onResources() {
        // Navigate to resources page
    }
}