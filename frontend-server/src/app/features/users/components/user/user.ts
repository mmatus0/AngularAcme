import { Component } from '@angular/core';
import { CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-user',
  imports: [CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent {
  data = new Array(10000).fill(1).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar()
  }));
}
