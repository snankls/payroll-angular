import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@siemens/ngx-datatable';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../../environments/environment';
import { NgSelectComponent as MyNgSelectComponent } from '@ng-select/ng-select';

interface User {
  company_id: number | null;
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  gender: string | null;
  date_of_birth?: NgbDateStruct | string | null;
  city_id: number | null;
  status: string | null;
  address: string;
  image?: File | string | null;
  image_url?: string;
  images?: {
    image_name: string;
  };
}

@Component({
  selector: 'app-setup',
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
  templateUrl: './setup.component.html'
})
export class UsersSetupComponent {
  private API_URL = environment.API_URL;
  private IMAGE_URL = environment.IMAGE_URL;

  currentRecord: User = {
    company_id: null,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    gender: null,
    date_of_birth: '',
    city_id: null,
    status: null,
    address: '',
    image: ''
  };
  
  globalError: string = '';
  globalErrorMessage: string = '';
  isEditMode = false;
  isLoading = false;
  errorMessage: any;
  selected: any[] = [];
  formErrors: any = {};
  cities: any[] = [];
  gender: { id: string; name: string }[] = [];
  status: { id: string; name: string }[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  companies: any[] = [];
  
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCompanies();
    this.fetchCities();
    this.fetchStatus();

    this.gender = [
      { id: 'Male', name: 'Male' },
      { id: 'Female', name: 'Female' },
      { id: 'Other', name: 'Other' },
    ];

    // Handle id-based route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchUsers(+id);
      }
    });
  }

  clearError(field: string): void {
    if (this.formErrors[field]) {
      delete this.formErrors[field];
    }
  }

  fetchCompanies(): void {
    this.http.get<any[]>(`${this.API_URL}/active/companies`).subscribe({
      next: (response) => {
        // Map each asset type to add a custom label
        this.companies = response.map((companies) => ({
          ...companies
        }));
      },
      error: (error) => console.error('Failed to fetch employees:', error)
    });
  }

  fetchCities(): void {
    this.http.get<any>(`${this.API_URL}/active/cities`).subscribe({
      next: (response) => {
        this.cities = response;
      },
      error: (error) => console.error('Failed to fetch cities:', error)
    });
  }

  fetchStatus(): void {
    this.http.get<any>(`${this.API_URL}/status`).subscribe({
      next: (response) => {
        this.status = Object.entries(response)
          .filter(([key]) => key !== '')
          .map(([key, value]) => ({ id: String(key), name: value as string }));
      },
      error: (error) => console.error('Failed to fetch status:', error)
    });
  }

  fetchUsers(id: number) {
    this.http.get<User>(`${this.API_URL}/user/${id}`).subscribe(user => {
      this.currentRecord = {
        ...this.currentRecord,
        ...user,
        
        date_of_birth: this.parseDateFromBackend(
          typeof user.date_of_birth === 'string' ? user.date_of_birth : undefined
        ),
      };
  
      if (user.images && user.images.image_name) {
        this.imagePreview = `${this.IMAGE_URL}/uploads/users/${user.images.image_name}`;
      }
  
      this.isEditMode = true;
    });
  }

  // Add these methods to your component class
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  formatDate(date: NgbDateStruct | string | undefined): string {
    if (typeof date === 'string') return date;
    if (!date) return '';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }
  
  // Add your onSubmit method
  onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading = true;  

    const formData = new FormData();
    const entries = Object.entries(this.currentRecord) as [keyof User, any][];

    for (const [key, value] of entries) {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'date_of_birth') {
          formData.append(key, this.formatDate(value));
        } else {
          formData.append(key, value);
        }
      }
    }

    // Append image if selected
    if (this.selectedFile) {
      formData.append('user_image', this.selectedFile);
    }
  
    this.http.post(`${this.API_URL}/users`, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.isLoading = false;
        this.formErrors = error.error.errors || {};
  
        // Show global error
        this.globalErrorMessage = 'Please fill all required fields correctly.';
  
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  updateRecord(event: Event): void {
    event.preventDefault();
    this.isLoading = true;
  
    const formData = new FormData();
    console.log(formData)
    const entries = Object.entries(this.currentRecord) as [keyof User, any][];
  
    for (const [key, value] of entries) {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'date_of_birth') {
          formData.append(key, this.formatDate(value));
        } else {
          formData.append(key, value);
        }
      }
    }
  
    if (this.selectedFile) {
      formData.append('user_image', this.selectedFile);
    }
  
    // Proceed with the API request to update user data
    this.http.post(`${this.API_URL}/users`, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.isLoading = false;
        // Check if the error is related to a duplicate value like email, etc.
        if (error?.error?.errors) {
          this.formErrors = error.error.errors;
        }
      }
    });
  }

  // Add this error handling method
  private handleError(error: any): void {
    if (error.error?.errors) {
      // Format errors to match what the template expects
      this.formErrors = error.error.errors;
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'An unknown error occurred';
    }
    
    // Scroll to the first error
    setTimeout(() => {
      const firstErrorElement = document.querySelector('.text-danger');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  // Convert to yyyy-mm-dd string for backend
  private formatDateForBackend(date: NgbDateStruct | string | undefined): string | null {
    if (!date) return null;
    
    // If already a string, return it directly
    if (typeof date === 'string') return date;
    
    // If NgbDateStruct, format it
    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
  }

  // Convert from backend string to NgbDateStruct
  private parseDateFromBackend(dateString: string | undefined): NgbDateStruct | null {
    if (!dateString) return null;
    
    // If already in NgbDateStruct format, return it
    if (typeof dateString === 'object' && 'year' in dateString) {
      return dateString;
    }
    
    // Parse string date
    const parts = dateString.split('-');
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10)
    };
  }

}
