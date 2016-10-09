import { Component, Input, Output, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: 'modal.html',
})
export class Modal implements AfterViewInit {

    @Input() title: string;
    @Input() showClose: boolean = true;
    @Output() onClose: EventEmitter<any> = new EventEmitter();

    modalEl: FoundationSites.Reveal = null;
    id: string = uniqueId('modal_');

    constructor(private _rootNode: ElementRef) {}

    open() {
        this.modalEl.open();
    }

    close() {
        this.modalEl.close();
    }

    closeInternal() { // close modal when click on times button in up-right corner
        this.onClose.next(null); // emit event
        this.close();
    }

    ngAfterViewInit() {
        let reveal: { new (element: Object, options?: FoundationSites.IRevealOptions): FoundationSites.Reveal } = <any>Foundation.Reveal;
        this.modalEl = new reveal($(this._rootNode.nativeElement).find('.reveal'));
    }
}

let modal_id: number = 0;
export function uniqueId(prefix: string): string {
    return prefix + ++modal_id;
}