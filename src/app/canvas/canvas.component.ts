import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as joint from 'jointjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;
  private graph = new joint.dia.Graph();
  private paper!: joint.dia.Paper;
  private firstElement: joint.dia.Element | null = null;

  ngAfterViewInit(): void {
    this.initializePaper();
  }

  private initializePaper(): void {
    this.paper = new joint.dia.Paper({
      el: this.canvas.nativeElement,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: true,
      interactive: { elementMove: true, linkMove: true },
    });

    // Listen for element clicks
    this.paper.on(
      'element:pointerdown',
      (elementView: joint.dia.ElementView) => {
        this.onElementClick(elementView);
      }
    );

    // Listen for link clicks to enable deletion
    this.paper.on('link:pointerdown', (linkView: joint.dia.LinkView) => {
      this.onLinkClick(linkView);
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
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
        label: { text: 'Class', fill: 'black' },
      });
    } else if (type === 'method') {
      element = new joint.shapes.standard.Rectangle();
      element.position(x, y);
      element.resize(80, 30);
      element.attr({
        body: { fill: 'lightgreen' },
        label: { text: 'Method', fill: 'black' },
      });
    }

    if (element) {
      this.graph.addCell(element);
    }
  }

  private onElementClick(elementView: joint.dia.ElementView): void {
    const element = elementView.model as joint.dia.Element;

    if (this.firstElement) {
      // Check if this is a self-link or a link to another element
      const link = new joint.shapes.standard.Link();
      link.source(this.firstElement);
      link.target(element);
      link.router('orthogonal'); // Use orthogonal routing for a polyline effect
      link.connector('rounded'); // Use rounded connector for smooth edges
      link.attr({
        line: {
          stroke: 'black',
          strokeWidth: 2,
        },
      });

      // Enable vertices to allow polyline adjustments
      link.set('smooth', false); // Set smooth to false to enable vertices
      link.vertices([]); // Initialize with no vertices; user can adjust them

      this.graph.addCell(link);

      // Reset firstElement after linking
      this.firstElement = null;
    } else {
      // Set the clicked element as the first element for linking
      this.firstElement = element;
    }
  }

  private onLinkClick(linkView: joint.dia.LinkView): void {
    // Remove the link when clicked
    linkView.model.remove();
  }
}
