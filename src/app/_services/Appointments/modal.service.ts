import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private ngbModal: NgbModal) { }

  open(content: any, size?: 'sm' | 'lg' | 'xl', windowClass: string = 'compact') {
    if (size === 'xl') {
      size = 'xl' as 'lg';
    }
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: size
    };
    if (windowClass) {
      ngbModalOptions.windowClass = windowClass;
    }

    return this.ngbModal.open(content, ngbModalOptions);
  }

}
