import {
  Directive,
  HostBinding,
  HostListener,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen: boolean = false;
  @HostListener('click') onClick() {
    this.isOpen = !this.isOpen;
  }

  //   firstClick: boolean = true;
  //   constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  //   @HostListener('click', ['$event']) onClick(eventData: Event) {
  //     if (this.firstClick) {
  //       this.renderer.addClass(this.elementRef.nativeElement, 'open');
  //     } else {
  //       this.renderer.removeClass(this.elementRef.nativeElement, 'open');
  //     }
  //     this.firstClick = !this.firstClick;
  //   }
}
