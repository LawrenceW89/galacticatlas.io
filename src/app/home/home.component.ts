import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarMapComponent } from '../star-map/star-map.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StarMapComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showHome: boolean = true;
  showNews: boolean = false;
  showAbout: boolean = false;

  showSection(section: 'home' | 'news' | 'about') {
    this.showHome = section === 'home';
    this.showNews = section === 'news';
    this.showAbout = section === 'about';
  }
}
