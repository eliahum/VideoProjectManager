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
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeadService } from '../../../services/lead.service';
import { LeadStatusService } from '../../../services/lead-status.service';
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
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.scss'
})
export class LeadFormComponent implements OnInit {
  leadForm: FormGroup;
  leadStatuses: LeadStatus[] = [];
  isEditMode = false;
  notInterestedStatus: LeadStatus | undefined;

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private leadStatusService: LeadStatusService,
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
      freeText: [''],
      companyName: ['', Validators.required],
      contactDate: [new Date(), Validators.required],
      statusNumber: [1, Validators.required],
      notInterestedReason: [''],
      priceQuote: ['']
    });
  }

  ngOnInit(): void {
    // טען סטטוסים מהשרת
    this.leadStatusService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.leadStatuses = response.data;
        this.notInterestedStatus = this.leadStatuses.find(s => s.name === 'לא מעוניין');
        
        // אם יש data, עדכן את הטופס
        if (this.data) {
          this.isEditMode = true;
          this.leadForm.patchValue(this.data);
        } else {
          // אם זה lead חדש, קבע את הסטטוס הראשון (מספר 1)
          const newStatus = this.leadStatuses.find(s => s.statusNumber === 1);
          if (newStatus) {
            this.leadForm.patchValue({ statusNumber: newStatus.statusNumber });
          }
        }
      }
    });

    // הצגת שדה "לא מעוניין" רק כאשר הסטטוס הוא "לא מעוניין"
    this.leadForm.get('statusNumber')?.valueChanges.subscribe(statusNumber => {
      const notInterestedControl = this.leadForm.get('notInterestedReason');
      const selectedStatus = this.leadStatuses.find(s => s.statusNumber === statusNumber);
      if (selectedStatus?.name === 'לא מעוניין') {
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
    const closedStatus = this.leadStatuses.find(s => s.isFinal && s.name === 'סגירה');
    
    // בדוק אם הסטטוס הנוכחי הוא סופי
    const currentStatus = this.leadStatuses.find(s => s.statusNumber === leadData.statusNumber);
    if (currentStatus?.isFinal) {
      this.messageDialogService.showError('Lead זה כבר הומר ללקוח.');
      return;
    }

    this.messageDialogService.confirm('האם להמיר Lead זה ללקוח?').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        const customerData = {
          name: leadData.name,
          email: leadData.email || '',
          phone: leadData.phone,
          companyName: leadData.companyName,
          source: leadData.source,
          freeText: leadData.freeText,
          leadId: leadData.leadId
        };
        this.customerService.create(customerData).subscribe(customerResponse => {
          if (customerResponse.isSuccess) {
            this.leadService.updateStatus(this.data.id, closedStatus?.statusNumber || 5).subscribe(leadResponse => {
              if (leadResponse.isSuccess) {
                this.messageDialogService.showSuccess('הלקוח נוצר בהצלחה!');
                this.dialogRef.close(true);
              } else {
                console.error('Failed to update lead status:', leadResponse.errorText);
                this.messageDialogService.showError('שגיאה בעדכון סטטוס Lead: ' + (leadResponse.errorText || 'Unknown error'));
              }
            });
          } else {
            console.error('Failed to create customer:', customerResponse.errorText);
            this.messageDialogService.showError('שגיאה ביצירת לקוח: ' + (customerResponse.errorText || 'Unknown error'));
          }
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  openPriceQuoteLink(): void {
    const link = this.leadForm.get('priceQuote')?.value;
    if (link) {
      // Ensure the link starts with http:// or https://
      const url = link.startsWith('http://') || link.startsWith('https://') 
        ? link 
        : 'https://' + link;
      window.open(url, '_blank');
    }
  }

  get showNotInterestedReason(): boolean {
    const statusNumber = this.leadForm.get('statusNumber')?.value;
    const selectedStatus = this.leadStatuses.find(s => s.statusNumber === statusNumber);
    return selectedStatus?.name === 'לא מעוניין';
  }

  get hasCustomer(): boolean {
    return this.data?.hasCustomer || false;
  }
}
