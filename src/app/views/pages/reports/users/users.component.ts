import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@siemens/ngx-datatable';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { NgSelectComponent as MyNgSelectComponent } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    RouterLink,
    NgxDatatableModule,
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    MyNgSelectComponent,
  ],
  templateUrl: './users.component.html'
})
export class ReportsUsersComponent {
  private API_URL = environment.API_URL;
  private IMAGE_URL = environment.IMAGE_URL;
  private LIVE_URL = environment.LIVE_URL;
  
  rows: any[] = [];
  temp: any[] = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  searchModel = {
    full_name: '',
    email: '',
    status: null
  };
  
  status = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'Inactive' }
  ];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.onAdvancedSearch();
  }
  
  onAdvancedSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.loadingIndicator = true;
  
    const params = {
      full_name: this.searchModel.full_name || '',
      email: this.searchModel.email || '',
      status: this.searchModel.status !== null ? this.searchModel.status : ''
    };
  
    this.http.get<any[]>(`${this.API_URL}/report/users`, { params }).subscribe({
      next: (data) => {
        console.log(data)
        this.rows = data;
        this.temp = [...data];
        this.loadingIndicator = false;

        // Optionally, you can process image_url if necessary (e.g., fallback for missing images)
        this.rows.forEach((user) => {
          user.user_image = user.user_image
            ? `${this.IMAGE_URL}/storage/users/${user.user_image}`
            : 'images/placeholder.png';
        });
      },
      error: () => {
        this.loadingIndicator = false;
      }
    });
  }  
  
  resetSearch(): void {
    this.searchModel = {
      full_name: '',
      email: '',
      status: null
    };
    this.onAdvancedSearch(new Event('submit'));
  }

  downloadFile(type: 'excel' | 'pdf'): void {
    const params = new URLSearchParams();
    if (this.searchModel.full_name) params.append('full_name', this.searchModel.full_name);
    if (this.searchModel.email) params.append('email', this.searchModel.email);
    if (this.searchModel.status !== null) params.append('status', this.searchModel.status);
  
    const queryString = params.toString();
    const url = `${this.LIVE_URL}/export/users/${type}?${queryString}`;
  
    window.open(url, '_blank');
  }
  
  
}
