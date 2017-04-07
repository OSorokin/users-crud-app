import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html'
})

export class UserDeleteModalComponent {

  @ViewChild('content')
  content;

  constructor(public modalService: NgbModal) {}

  public open(): NgbModalRef {
    return this.modalService.open(this.content);
  }

}
