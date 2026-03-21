import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DateService } from './services/date-service';
import { YearsModule } from './years/years.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { UidService } from './services/uid.service';
import { PostItMockService } from './services/post-it/post-it.mock.service';
import { POST_IT_SERVICE } from './services/post-it/post-it.interface.service';
import { PostItBoardComponent } from './post-it-board/post-it-board.component';

@NgModule({
  declarations: [
    AppComponent,
    PostItBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    YearsModule
  ],
  providers: [
    DateService,
    UidService,
    { provide: POST_IT_SERVICE, useClass: PostItMockService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
