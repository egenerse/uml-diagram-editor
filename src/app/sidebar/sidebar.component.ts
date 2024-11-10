import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  onDragStart(event: DragEvent, type: string): void {
    event.dataTransfer?.setData('elementType', type);
  }
}
