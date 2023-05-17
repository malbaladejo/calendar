import { Component } from '@angular/core';
import { YearViewModel } from './view-models/year-viewmodel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngCalendar';

  public yearViewModel: YearViewModel;

  constructor() {
    this.yearViewModel = new YearViewModel(new Date(), 0);
  }

  public previous() {
    this.yearViewModel.previous();
  }

  public next() {
    this.yearViewModel.next();
  }
}
