import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../../services/project.service';
import { CustomerService } from '../../../services/customer.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Project } from '../../../models/project.model';
import { Customer } from '../../../models/customer.model';
import { convertDateToUTC } from '../../../utils/date.utils';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerFormComponent } from '../../customers/customer-form/customer-form.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  projectForm: FormGroup;
  isEditMode = false;
  customers: Customer[] = [];
  customerInputCtrl = new FormControl<Customer | string | null>(null, Validators.required);
  filteredCustomers!: Observable<Customer[]>;
  selectedCustomer: Customer | null = null;
  customerContacts: any[] = [];
  private subs: Subscription[] = [];
  private hasTyped = false;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  displayCustomer = (customer?: Customer | string | null): string => {
    return typeof customer === 'string' ? customer : (customer?.companyName || '');
  };

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private customerService: CustomerService,
    private messageDialogService: MessageDialogService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.projectForm = this.fb.group({
      customerId: ['', Validators.required],
      contactPersonId: ['', Validators.required],
      projectName: ['', Validators.required],
      cost: [0],
      paidAmount: [0],
      paymentDate: [null],
      paymentNote: [''],
      initializeAllStages: [false]
    });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.customers = response.data;
        // Setup filtered customers stream for autocomplete

        this.filteredCustomers = this.customerInputCtrl.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : (value?.companyName ?? '')),
          map(name => {
            const v = (name ?? '').trim().toLowerCase();
            // 👇 key line: if no typing -> return EMPTY LIST (so panel won't open)
            if (v.length < 1) return [];
            return this.customers.filter(c => c.companyName?.toLowerCase().includes(v));
          })
        );

        // If editing, initialize the autocomplete display to the current customer
        if (this.isEditMode && this.data) {
          const currentCustomer = this.customers.find(c => c.id === this.data.customerId);
          if (currentCustomer) {
            this.customerInputCtrl.setValue(currentCustomer, { emitEvent: false });
          }
        }

        // Open panel after first typed character; close when cleared
        const sub = this.customerInputCtrl.valueChanges.subscribe(value => {
          const str = typeof value === 'string' ? value : '';
          if (str && str.length >= 1) {
            this.hasTyped = true;
            this.autocompleteTrigger?.openPanel();
          } else {
            this.hasTyped = false;
            this.autocompleteTrigger?.closePanel();
          }
        });
        this.subs.push(sub);
      } else {
        console.error('Failed to load customers:', response.errorText);
        this.messageDialogService.showError('שגיאה בטעינת לקוחות: ' + (response.errorText || 'Unknown error'));
      }
    });
    if (this.data) {
      this.isEditMode = true;
      this.projectForm.patchValue({
        ...this.data,
        paymentDate: this.data.paymentDate ? new Date(this.data.paymentDate) : null
      });
    }
    else {
      this.projectForm.patchValue({
        paymentDate: new Date()
      });
    }
  }

  isFormValid(): boolean {
    return this.projectForm.valid && this.customerInputCtrl.valid && !!this.projectForm.get('customerId')?.value;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.projectForm.markAllAsTouched();
      this.customerInputCtrl.markAsTouched();
      return;
    }

    const projectData = this.projectForm.value;
    const customer = this.customers.find(c => c.id === projectData.customerId);

    if (!customer) {
      this.messageDialogService.showError('לקוח לא נמצא');
      return;
    }

    const fullProjectData = {
      ...projectData,
      paymentDate: convertDateToUTC(projectData.paymentDate),
      customerName: customer.name,
      stages: [],
      initializeAllStages: projectData.initializeAllStages
    };

    if (this.isEditMode) {
      this.projectService.update(this.data.id, fullProjectData).subscribe(response => {
        if (response.isSuccess) {
          this.dialogRef.close(true);
        } else {
          this.messageDialogService.showError('שגיאה בעדכון פרוייקט: ' + (response.errorText || 'Unknown error'));
        }
      });
    } else {
      this.projectService.create(fullProjectData).subscribe(response => {
        if (response.isSuccess) {
          this.dialogRef.close(true);
        } else {
          this.messageDialogService.showError('שגיאה ביצירת פרוייקט: ' + (response.errorText || 'Unknown error'));
        }
      });
    }
  }

  onCustomerSelected(selected: Customer): void {
    if (selected && selected.id) {
      this.projectForm.get('customerId')?.setValue(selected.id);
      this.customerInputCtrl.setValue(selected);
      this.customerInputCtrl.markAsTouched();
      
      // Load customer contacts
      this.selectedCustomer = selected;
      this.customerContacts = selected.contacts || [];
      
      // Set primary contact as default
      if (this.customerContacts.length > 0) {
        const primaryContact = this.customerContacts.find(c => c.isPrimary);
        const defaultContact = primaryContact || this.customerContacts[0];
        this.projectForm.get('contactPersonId')?.setValue(defaultContact._id);
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onCustomerFocus(): void {
    // Ensure panel doesn't open just on focus, only after typing
    if (!this.hasTyped) {
      setTimeout(() => {
        this.autocompleteTrigger?.closePanel();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  openCustomerForm(): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh customers list
        this.customerService.getAll().subscribe(response => {
          if (response.isSuccess && response.data) {
            this.customers = response.data;
            // Select the newly created customer (should be the last one)
            const newCustomer = this.customers[this.customers.length - 1];
            if (newCustomer) {
              this.customerInputCtrl.setValue(newCustomer);
              this.projectForm.get('customerId')?.setValue(newCustomer.id);
            }
          }
        });
      }
    });
  }
}
