import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbDropdownModule, NgbNavContent, NgbNavModule, NgbTooltip, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

interface Employee {
  id?: number;
  code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string | null;
  date_of_birth?: string | null;
  joining_date: string | null;
  resign_date?: string | null;
  department_name: number | null;
  designation_name: number | null;
  job_type_name: string | number | null;
  city_name: number | null;
  bank_name: number | null;
  account_number: string | null;
  basic_salary: number;
  house_rent?: number;
  medical_allowances?: number;
  petrol_allowances?: number;
  total_salary: number;
  status: number | null;
  address: string;
  description?: string;
  image?: File | string | null;
  image_url?: string;
  slug?: string;
  images?: {
    image_name: string;
  };
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgbNavModule,
    NgbNavContent,
    NgbNavOutlet,
    NgbDropdownModule,
    NgbTooltip
  ],
  templateUrl: './view.component.html'
})
export class EmployeesViewComponent {
  private API_URL = environment.API_URL;
  private IMAGE_URL = environment.IMAGE_URL;

  currentRecord: Employee = {
    code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: null,
    date_of_birth: '',
    joining_date: '',
    resign_date: '',
    department_name: null,
    designation_name: null,
    job_type_name: null,
    city_name: null,
    bank_name: null,
    account_number: null,
    basic_salary: 0,
    house_rent: 0,
    medical_allowances: 0,
    petrol_allowances: 0,
    total_salary: 0,
    status: null,
    address: '',
    image: ''
  };

  defaultNavActiveId = 1;
  rows: any[] = [];
  loadingIndicator = false;
  employee_status: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      //private router: Router
    ) {}

  ngOnInit(): void {
    // Handle slug-based route
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchEmployees(slug);
      }
    });
  }

  fetchEmployees(slug: string): void {
    this.http.get<Employee>(`${this.API_URL}/employee/${slug}`).subscribe(employee => {
      this.currentRecord = {
        ...this.currentRecord,
        ...employee,
      };

      if (employee.status) {
        this.employee_status = employee.status === 1 ? 'Active' : 'Inactive';
      }
  
      if (employee.images && employee.images.image_name) {
        this.imagePreview = `${this.IMAGE_URL}/storage/employees/${employee.images.image_name}`;
      }
    });
  }

}
