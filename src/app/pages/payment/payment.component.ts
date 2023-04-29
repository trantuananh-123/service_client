import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/app/services/payment.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserStorageService } from 'src/app/services/user-storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(
    private location: Location,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: SpinnerService,
    private userStorageService: UserStorageService,
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(this.userStorageService.getUser()!);
    this.spinner.show();
    const queryParam = this.location.path().split('?')[1];
    if (queryParam) {
      this.paymentService.pay('?' + queryParam + '&userId=' + user?.id).subscribe(data => {
        if (data) {
          this.toastr.success('Subscribe successfully', 'Success');
          this.spinner.hide();
          this.router.navigate(['/']);
        }
      })
    }
  }

}
