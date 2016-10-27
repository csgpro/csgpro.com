// angular
import { Injectable }         from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';

// app
import { ApiService } from '../../services/api.service';
import { Topic }      from './topic.model';

@Injectable()
export class TopicService {
    constructor(private _apiService: ApiService) {}

    get(topicId?: number): Promise<Topic>;
    get(search?: RequestOptionsArgs): Promise<Topic[]>;
    get(search?: number|RequestOptionsArgs) {
        if (typeof search === 'number') {
            return this._apiService.get<Topic>(`topic/${search}`);
        }
        return this._apiService.get<Topic>('topic', search);
    }
}