import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as joint from 'jointjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;
  private graph = new joint.dia.Graph();
  private paper!: joint.dia.Paper;

  ngAfterViewInit(): void {
    this.initializePaper();
  }

  private initializePaper(): void {
    this.paper = new joint.dia.Paper({
      el: this.canvas.nativeElement, // Bind the paper to the DOM element
      model: this.graph,             // Connect graph to paper
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: true,
      interactive: { elementMove: true }  // Enable moving elements
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();  // Necessary to allow drop
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const elementType = event.dataTransfer?.getData('elementType');
    const x = event.offsetX;
    const y = event.offsetY;
    if (elementType) {
      this.addElementToCanvas(elementType, x, y);
    }
  }

  private addElementToCanvas(type: string, x: number, y: number): void {
    let element;

    if (type === 'class') {
      element = new joint.shapes.standard.Rectangle();
      element.position(x, y);
      element.resize(100, 40);
      element.attr({
        body: { fill: 'lightblue' },
        label: { text: 'Class', fill: 'black' }
      });
    } else if (type === 'method') {
      element = new joint.shapes.standard.Rectangle();
      element.position(x, y);
      element.resize(80, 30);
      element.attr({
        body: { fill: 'lightgreen' },
        label: { text: 'Method', fill: 'black' }
      });
    }

    if (element) {
      this.graph.addCell(element);  // Add element to the graph, which syncs with the paper
    }
  }
}
