// angular
import {Injectable} from '@angular/core';
import {RequestOptionsArgs} from '@angular/http';

// app
import {ApiService} from '../../services/api.service';
import {Category} from './category.model';

@Injectable()
export class CategoryService {
    constructor(private _apiService: ApiService) {}

    get(categoryId?: number): Promise<Category>;
    get(search?: RequestOptionsArgs): Promise<Category[]>;
    get(search?: number|RequestOptionsArgs) {
        if (typeof search === 'number') {
            return this._apiService.get<Category>(`category/${search}`);
        }
        return this._apiService.get<Category>('category', search);
    }
}