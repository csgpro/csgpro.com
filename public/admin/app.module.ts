// angular
import { NgModule }          from '@angular/core';
import { BrowserModule }     from '@angular/platform-browser';
import { FormsModule }       from '@angular/forms';
import { HttpModule }        from '@angular/http';
import { MaterialModule }    from '@angular/material';
import { Ng2MaterialModule } from 'ng2-material';
import { AUTH_PROVIDERS }    from 'angular2-jwt';
import { FileUploadModule }      from 'ng2-file-upload';

// app
import { AppComponent }      from './app.component';
import { AppRoutingModule }  from './app-routing.module';
import { ComponentProvider } from './components';
import { PageProvider }      from './pages';
import { ServiceProvider }   from './services';
import { CategoryService, ContactService, PostService, TopicService, UserService } from './models';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule.forRoot(),
        Ng2MaterialModule.forRoot(),
        FileUploadModule,
        AppRoutingModule
    ],
    providers: [
        AUTH_PROVIDERS,
        ServiceProvider,
        CategoryService,
        ContactService,
        PostService,
        TopicService,
        UserService
    ],
    declarations: [
        AppComponent,
        ComponentProvider,
        PageProvider
    ],
    exports: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
