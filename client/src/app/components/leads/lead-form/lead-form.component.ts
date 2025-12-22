import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { LeadService } from '../../../services/lead.service';
import { CustomerService } from '../../../services/customer.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Lead, LeadStatus } from '../../../models/lead.model';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.scss'
})
export class LeadFormComponent implements OnInit {
  leadForm: FormGroup;
  leadStatuses = Object.values(LeadStatus);
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private customerService: CustomerService,
    private messageDialogService: MessageDialogService,
    private dialogRef: MatDialogRef<LeadFormComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Lead
  ) {
    this.leadForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      source: [''],
      freeText: ['', Validators.required],
      companyName: ['', Validators.required],
      contactDate: [new Date(), Validators.required],
      status: [LeadStatus.NEW, Validators.required],
      notInterestedReason: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.leadForm.patchValue(this.data);
    }

    // הצגת שדה "לא מעוניין" רק כאשר הסטטוס הוא "לא מעוניין"
    this.leadForm.get('status')?.valueChanges.subscribe(status => {
      const notInterestedControl = this.leadForm.get('notInterestedReason');
      if (status === LeadStatus.NOT_INTERESTED) {
        notInterestedControl?.setValidators([Validators.required]);
      } else {
        notInterestedControl?.clearValidators();
        notInterestedControl?.setValue('');
      }
      notInterestedControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.leadForm.valid) {
      const leadData = this.leadForm.value;
      
      if (this.isEditMode) {
        this.leadService.update(this.data.id, leadData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.leadService.create(leadData).subscribe(() => {
          this.messageDialogService.showSuccess('Lead נוצר בהצלחה!');
          this.dialogRef.close(true);
        });
      }
    }
  }

  convertToCustomer(): void {
    const leadData = this.data || this.leadForm.value;
    if (leadData.status === LeadStatus.CLOSED) {
      this.messageDialogService.showError('Lead זה כבר הומר ללקוח.');
      return;
    }

    this.messageDialogService.confirm('האם להמיר Lead זה ללקוח?').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        const customerData = {
          name: leadData.name,
          email: leadData.email || '',
          phone: leadData.phone,
          leadId: leadData.leadId || undefined
        };
        this.customerService.create(customerData).subscribe(() => {
          // Update lead status to closed
          if (this.data) {
            this.leadService.updateStatus(this.data.id, LeadStatus.CLOSED).subscribe(() => {
              this.messageDialogService.showSuccess('הלקוח נוצר בהצלחה!');
              this.dialogRef.close(true);
            });
          } else {
            this.messageDialogService.showSuccess('הלקוח נוצר בהצלחה!');
            this.dialogRef.close(true);
          }
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  get showNotInterestedReason(): boolean {
    return this.leadForm.get('status')?.value === LeadStatus.NOT_INTERESTED;
  }
}
