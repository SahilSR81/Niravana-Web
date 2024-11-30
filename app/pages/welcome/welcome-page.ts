import { NavigatedData, Page } from '@nativescript/core';
import { WelcomeViewModel } from './welcome-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new WelcomeViewModel();
}