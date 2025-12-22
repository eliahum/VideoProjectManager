import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { LeadService } from '../../../services/lead.service';
import { MessageDialogService } from '../../../services/message-dialog.service';
import { Lead, LeadStatus } from '../../../models/lead.model';
import { LeadFormComponent } from '../lead-form/lead-form.component';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-leads-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './leads-list.component.html',
  styleUrl: './leads-list.component.scss'
})
export class LeadsListComponent implements OnInit {
  leads: Lead[] = [];
  allLeads: Lead[] = [];
  filteredLeads: Lead[] = [];
  paginatedLeads: Lead[] = [];
  searchText: string = '';
  displayedColumns: string[] = ['leadid','name', 'phone', 'email', 'companyName', 'status', 'contactDate', 'actions'];
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private leadService: LeadService,
    private messageDialogService: MessageDialogService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  convertLeadToCustomer(lead: Lead): void {
    if (lead.status === LeadStatus.CLOSED) {
      this.messageDialogService.showError('Lead זה כבר הומר ללקוח.');
      return;
    }

    this.messageDialogService.confirm('האם להמיר Lead זה ללקוח?').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        const customerData = {
          name: lead.name,
          email: lead.email || '',
          phone: lead.phone,
          companyName: lead.companyName,
          source: lead.source,
          freeText: lead.freeText,
          leadId: lead.leadId
        };
        this.customerService.create(customerData).subscribe(customerResponse => {
          if (customerResponse.isSuccess) {
            this.leadService.updateStatus(lead.id, LeadStatus.CLOSED).subscribe(leadResponse => {
              if (leadResponse.isSuccess) {
                this.messageDialogService.showSuccess('הלקוח נוצר בהצלחה!');
                this.loadLeads();
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

  loadLeads(): void {
    this.leadService.getAll().subscribe(response => {
      if (response.isSuccess && response.data) {
        this.allLeads = [...response.data];
        this.applyFilter();
        this.cdr.detectChanges();
      } else {
        console.error('Failed to load leads:', response.errorText);
        this.messageDialogService.showError('שגיאה בטעינת Leads: ' + (response.errorText || 'Unknown error'));
      }
    });
  }

  applyFilter(): void {
    const text = this.searchText ? this.searchText.trim().toLowerCase() : '';
    if (!text) {
      this.filteredLeads = [...this.allLeads];
    } else {
      this.filteredLeads = this.allLeads.filter(lead => {
        return Object.values(lead).some(val =>
          val && val.toString().toLowerCase().includes(text)
        );
      });
    }
    this.pageIndex = 0;
    this.updatePaginatedLeads();
  }

  updatePaginatedLeads(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedLeads = this.filteredLeads.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedLeads();
  }

  get totalItems(): number {
    return this.filteredLeads.length;
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  openLeadForm(lead?: Lead): void {
    const dialogRef = this.dialog.open(LeadFormComponent, {
      width: '600px',
      data: lead
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.loadLeads();
       
      }
    });
  }

  deleteLead(id: string): void {
    this.messageDialogService.confirm('האם אתה בטוח שברצונך למחוק Lead זה?', 'אישור מחיקה').subscribe((result: 'yes' | 'no') => {
      if (result === 'yes') {
        this.leadService.delete(id).subscribe(response => {
          if (response.isSuccess) {
            this.messageDialogService.showSuccess('Lead נמחק בהצלחה');
            this.loadLeads();
          } else {
            console.error('Failed to delete lead:', response.errorText);
            this.messageDialogService.showError('שגיאה במחיקת Lead: ' + (response.errorText || 'Unknown error'));
          }
        });
      }
    });
  }

  getStatusClass(status: LeadStatus): string {
    switch (status) {
      case LeadStatus.NEW: return 'status-new';
      case LeadStatus.QUOTE: return 'status-quote';
      case LeadStatus.PAUSED: return 'status-paused';
      case LeadStatus.NOT_INTERESTED: return 'status-not-interested';
      case LeadStatus.CLOSED: return 'status-closed';
      default: return '';
    }
  }
}
