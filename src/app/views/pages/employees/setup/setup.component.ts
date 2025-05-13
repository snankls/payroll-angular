import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@siemens/ngx-datatable';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../../environments/environment';
import { NgSelectComponent as MyNgSelectComponent } from '@ng-select/ng-select';

interface Employee {
  id?: number;
  code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  religion: string | null;
  gender: string | null;
  date_of_birth?: NgbDateStruct | string | null;
  joining_date: NgbDateStruct | string | null;
  resign_date?: NgbDateStruct | string | null;
  department_id: number | null;
  designation_id: number | null;
  job_type_id: string | number | null;
  city_id: number | null;
  bank_id: number | null;
  basic_salary: number;
  house_rent?: number;
  medical_allowances?: number;
  petrol_allowances?: number;
  total_salary: number;
  status: string | null;
  address: string;
  description?: string;
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
export class EmployeesSetupComponent {
  private API_URL = environment.API_URL;
  private IMAGE_URL = environment.IMAGE_URL;

  currentRecord: Employee = {
    code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    religion: null,
    gender: null,
    date_of_birth: '',
    joining_date: '',
    resign_date: '',
    department_id: null,
    designation_id: null,
    job_type_id: null,
    city_id: null,
    bank_id: null,
    basic_salary: 0,
    house_rent: 0,
    medical_allowances: 0,
    petrol_allowances: 0,
    total_salary: 0,
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
  departments: any[] = [];
  designations: any[] = [];
  job_types: any[] = [];
  cities: any[] = [];
  banks: any[] = [];
  gender: { id: string; name: string }[] = [];
  religions: { id: string; name: string }[] = [];
  status: { id: string; name: string }[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  
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
    this.fetchDepartments();
    this.fetchDesignations();
    this.fetchJobTypes();
    this.fetchCities();
    this.fetchBanks();
    this.fetchReligion();
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
        this.loadEmployee(+id);
      }
    });
  }

  clearError(field: string): void {
    if (this.formErrors[field]) {
      delete this.formErrors[field];
    }
  }

  fetchDepartments(): void {
    this.http.get<any[]>(`${this.API_URL}/active/departments`).subscribe({
      next: (response) => {
        // Map each add a custom label
        this.departments = response.map((department) => ({
          ...department,
          department_label: `${department.name} (${department.code})`
        }));
      },
      error: (error) => console.error('Failed to fetch departments:', error)
    });
  }

  fetchDesignations(): void {
    this.http.get<any[]>(`${this.API_URL}/active/designations`).subscribe({
      next: (response) => {
        // Map each add a custom label
        this.designations = response.map((designation) => ({
          ...designation,
          designation_label: `${designation.name} (${designation.code})`
        }));
      },
      error: (error) => console.error('Failed to fetch designations:', error)
    });
  }

  fetchJobTypes(): void {
    this.http.get<any>(`${this.API_URL}/active/job-types`).subscribe({
      next: (response) => {
        this.job_types = response;
      },
      error: (error) => console.error('Failed to fetch job types:', error)
    });
  }

  fetchCities(): void {
    this.http.get<any[]>(`${this.API_URL}/active/cities`).subscribe({
      next: (response) => {
        // Map each add a custom label
        this.cities = response.map((city) => ({
          ...city,
          city_label: `${city.name} (${city.code})`
        }));
      },
      error: (error) => console.error('Failed to fetch cities:', error)
    });
  }

  fetchBanks(): void {
    this.http.get<any[]>(`${this.API_URL}/active/banks`).subscribe({
      next: (response) => {
        // Map each add a custom label
        this.banks = response.map((bank) => ({
          ...bank,
          bank_label: `${bank.account_title} (${bank.account_number})`
        }));
      },
      error: (error) => console.error('Failed to fetch banks:', error)
    });
  }

  fetchReligion(): void {
    this.http.get<any>(`${this.API_URL}/religions`).subscribe({
      next: (response) => {
        this.religions = Object.entries(response)
          .filter(([key]) => key !== '')
          .map(([key, value]) => ({ id: String(key), name: value as string }));
      },
      error: (error) => console.error('Failed to fetch religions:', error)
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

  loadEmployee(id: number) {
    this.isLoading = true;
    this.errorMessage = '';
    this.imagePreview = null;

    this.http.get<Employee>(`${this.API_URL}/employee/${id}`).subscribe({
      next: (employee) => {
        this.currentRecord = {
          ...this.currentRecord, // Preserve any existing values
          ...employee, // Override with API response

          date_of_birth: this.parseDateFromBackend(
            typeof employee.date_of_birth === 'string' ? employee.date_of_birth : undefined
          ),
          joining_date: this.parseDateFromBackend(
            typeof employee.joining_date === 'string' ? employee.joining_date : undefined
          ),
          resign_date: this.parseDateFromBackend(
            typeof employee.resign_date === 'string' ? employee.resign_date : undefined
          ),
        };

        // Handle image preview
        if (employee.images?.image_name) {
          this.imagePreview = `${this.IMAGE_URL}/uploads/employees/${employee.images.image_name}`;
        }

        this.isEditMode = true;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        
        if (error.status === 403 && error.error?.redirect) {
          // Unauthorized access - redirect to dashboard
          this.router.navigate(['/dashboard']);
        } else if (error.status === 404) {
          this.errorMessage = 'Employee record not found';
        } else {
          this.errorMessage = 'Failed to load employee details';
          console.error('Error isLoading employee:', error);
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // loadEmployee(id: number) {
  //   this.http.get<Employee>(`${this.API_URL}/employee/${id}`).subscribe(employee => {
  //     this.currentRecord = {
  //       ...this.currentRecord,
  //       ...employee,
        
  //       date_of_birth: this.parseDateFromBackend(
  //         typeof employee.date_of_birth === 'string' ? employee.date_of_birth : undefined
  //       ),
  //       joining_date: this.parseDateFromBackend(
  //         typeof employee.joining_date === 'string' ? employee.joining_date : undefined
  //       ),
  //       resign_date: this.parseDateFromBackend(
  //         typeof employee.resign_date === 'string' ? employee.resign_date : undefined
  //       ),
  //     };
  
  //     if (employee.images && employee.images.image_name) {
  //       this.imagePreview = `${this.IMAGE_URL}/uploads/employees/${employee.images.image_name}`;
  //     }
  
  //     this.isEditMode = true;
      
  //   });
  // }

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
    const entries = Object.entries(this.currentRecord) as [keyof Employee, any][];
  
    for (const [key, value] of entries) {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'date_of_birth' || key === 'joining_date' || key === 'resign_date') {
          formData.append(key, this.formatDate(value));
        } else {
          formData.append(key, value);
        }
      }
    }
  
    if (this.selectedFile) {
      formData.append('employee_image', this.selectedFile);
    }
  
    this.http.post(`${this.API_URL}/employees`, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/employees']);
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
    this.globalError = '';
  
    const formData = new FormData();
  
    // Add the form data
    const entries = Object.entries(this.currentRecord) as [keyof Employee, any][];
    for (const [key, value] of entries) {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'date_of_birth' || key === 'joining_date' || key === 'resign_date') {
          formData.append(key, this.formatDate(value));
        } else {
          formData.append(key, value);
        }
      }
    }
  
    // Check if the file is selected and append it
    if (this.selectedFile) {
      formData.append('employee_image', this.selectedFile);
    }
    
    // Proceed with the API request to update employee data
    this.http.post(`${this.API_URL}/employees`, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.isLoading = false;
        // Check if the error is related to a duplicate value like code, email, etc.
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

  // Add this method to calculate total salary
  calculateTotalSalary(): void {
    const basic = Number(this.currentRecord.basic_salary) || 0;
    const house = Number(this.currentRecord.house_rent) || 0;
    const medical = Number(this.currentRecord.medical_allowances) || 0;
    const transport = Number(this.currentRecord.petrol_allowances) || 0;
    
    this.currentRecord.total_salary = basic + house + medical + transport;
  }

  // Call this when salary components change
  onSalaryChange(): void {
    this.calculateTotalSalary();
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
