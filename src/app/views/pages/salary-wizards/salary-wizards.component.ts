import { Component, OnInit, ViewChild } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ArchwizardModule } from '@rg-software/angular-archwizard';
import { WizardComponent as BaseWizardComponent } from '@rg-software/angular-archwizard';
import { NgSelectComponent as MyNgSelectComponent } from '@ng-select/ng-select';
import { BreadcrumbComponent } from '../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../environments/environment';

interface Employee {
  id: number;
  full_name: string;
  code: string;
  joining_date: string;
  resign_date: string | null;
}

interface Salary {
  id: number;
  name: string;
  basic_salary: number;
  present_days: number;
  deductions: number;
  net_salary: number;
}

@Component({
  selector: 'app-salary-wizards',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgScrollbarModule,
    FormsModule,
    ArchwizardModule,
    MyNgSelectComponent,
    CommonModule
  ],
  templateUrl: './salary-wizards.component.html'
})
export class SalaryWizardsComponent implements OnInit {
  private API_URL = environment.API_URL;
  
  @ViewChild('wizardForm') wizardForm!: BaseWizardComponent;


  wizardStep = 1;
  selectedMonthYear: string = '';
  employeesWithAttendance: Employee[] = [];
  employeeSalaries: Salary[] = [];
  monthYearOptions: { id: string, label: string }[] = [];

  constructor(
    private http: HttpClient
  ) { }
  
  ngOnInit(): void {
    this.getMonth2();
  }

  getMonth2() {
    this.http.get<{ joining_date: string }>(`${this.API_URL}/salary-wizard/get-months`)
    .subscribe((res) => {
      const startDate = new Date(res.joining_date);
      const endDate = new Date();

      this.monthYearOptions = this.generateMonthYearList(startDate, endDate);

      // Optionally pre-select the latest month
      this.selectedMonthYear = this.monthYearOptions[this.monthYearOptions.length - 1]?.id || '';
    });
  }

  generateMonthYearList(startDate: Date, endDate: Date): { id: string, label: string }[] {
    const options: { id: string, label: string }[] = [];

    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;

      const id = `${year}-${month.toString().padStart(2, '0')}`;
      const label = `${current.toLocaleString('default', { month: 'long' })} ${year}`;

      options.push({ id, label });

      current.setMonth(current.getMonth() + 1);
    }

    return options;
  }

  nextStep() {
    if (this.wizardStep === 1) {
      this.fetchEmployeesWithAttendance(this.selectedMonthYear);
    } else if (this.wizardStep === 2) {
      this.calculateSalaries(this.selectedMonthYear);
    }
    this.wizardStep++;
  }

  goToNext() {
    if (this.selectedMonthYear && typeof this.selectedMonthYear === 'string') {
      this.fetchEmployeesWithAttendance(this.selectedMonthYear);
      this.wizardForm.goToNextStep(); // ✅ Use correct method
    } else {
      alert('Please select a valid month first');
    }
  }

  fetchEmployeesWithAttendance(monthYear: string) {
    const month = this.getMonth(monthYear);
    const year = this.getYear(monthYear);

    this.http.get<any>(`${this.API_URL}/salary-wizard/get-active-employees`, {
      params: { month, year }
    }).subscribe((res) => {
      console.log('Fetched employees:', res);
      this.employeesWithAttendance = res.employees; // ✅ Fix here
    });
  }

  calculateSalaries(monthYear: string) {
    const month = this.getMonth(monthYear);
    const year = this.getYear(monthYear);

    this.http.post<any[]>(`${this.API_URL}/salaries/calculate`, {
      month,
      year
    }).subscribe((res) => {
      this.employeeSalaries = res;
    });
  }

  getMonth(monthYear: string) {
    return parseInt(monthYear.split('-')[1]);  // Extracts the month part
  }

  getYear(monthYear: string) {
    return parseInt(monthYear.split('-')[0]);  // Extracts the year part
  }

  onMonthSelect(event: any) {
    this.selectedMonthYear = event.id; // Ensure you're getting the 'id' string (e.g., '2025-01')
    console.log('Selected monthYear:', this.selectedMonthYear); // Debug log to see the selected value
  }

}
