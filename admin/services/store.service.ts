// angular
import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
    
    getString(key: string): string {
        return localStorage.getItem(key);
    }

    setString(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    clearString(key: string) {
        localStorage.removeItem(key);
    }

    empty() {
        localStorage.clear();
    }
}