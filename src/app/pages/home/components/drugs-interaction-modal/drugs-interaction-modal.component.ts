import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IInteractionNotificationDTO } from '@interfaces/home/i-drug-drug-interaction';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'drugs-interaction-modal',
  templateUrl: './drugs-interaction-modal.component.html',
  styleUrls: ['./drugs-interaction-modal.component.scss']
})
export class DrugsInteractionModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, private router: Router) { }

  public event: EventEmitter<any> = new EventEmitter();
  @Input() title: string;
  @Input() subtitle: string;
  @Input() details: IInteractionNotificationDTO;

  ngOnInit(): void {
  }

  handleModalHide() {
    this.bsModalRef.hide()
  }

  backToHome() {
    this.router.navigateByUrl('/home')
    this.bsModalRef.hide()
  }

  openLinkInNewTab(url: string) {
    window.open(url);
  }

  onDiscardEvent() {
    this.event.emit({ action: "discard" });
    this.handleModalHide();
  }

  ifNotDDI() {
    let ifDDI = this.router.routerState.snapshot.url.startsWith('/drug-drug-interaction')
    return !ifDDI
  }

}
