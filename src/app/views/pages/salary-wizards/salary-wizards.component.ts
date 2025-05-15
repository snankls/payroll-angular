import { Component, OnInit, ViewChild } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  total_salary: number;
  attendance_days: number;
  loan_deduction: number;
}

interface Salary {
  id: number;
  name: string;
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
    ReactiveFormsModule,
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
  //selectedMonthYear: string = null;
  employeesWithAttendance: Employee[] = [];
  employeeSalaries: Salary[] = [];
  monthYearOptions: { id: string, label: string }[] = [];
  total_days_in_month: number = 0;
  total_working_days: number = 0;
  attendance_days: number = 0;
  total_salary: number = 0;
  loan_deduction: number = 0;
  submitted = false;
  selectedMonthYear: string | null = null;
  validationForm1: UntypedFormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    public formBuilder: UntypedFormBuilder,
  ) { }
  
  ngOnInit(): void {
    this.getMonth2();
    this.validationForm1 = this.formBuilder.group({
      month_year: [null, Validators.required],
    });
  }

  // Update getMonth2
  getMonth2() {
    this.http.get<{ joining_date: string }>(`${this.API_URL}/salary-wizard/get-months`)
    .subscribe((res) => {
      const startDate = new Date(res.joining_date);
      const endDate = new Date();
      this.monthYearOptions = this.generateMonthYearList(startDate, endDate);
      // No default selection - leave selectedMonthYear as null
    });
  }

  // Update goToNext
  // goToNext() {
  //   this.submitted = true;
  //   this.validationForm1.get('month_year')?.setValue(this.selectedMonthYear);
  //   this.validationForm1.markAllAsTouched();
    
  //   if (this.validationForm1.valid) {
  //     this.fetchEmployeesWithAttendance(this.selectedMonthYear!);
  //     this.wizardForm.goToNextStep();
  //   }
  // }

  // Update onMonthSelect
  onMonthSelect(event: any) {
    this.selectedMonthYear = event?.id || null;
    this.validationForm1.get('month_year')?.setValue(this.selectedMonthYear || '');
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


  // Update the fetchEmployeesWithAttendance method to handle null
  fetchEmployeesWithAttendance(monthYear: string | null) {
    if (!monthYear) {
      console.error('No month selected');
      return;
    }

    const month = this.getMonth(monthYear);
    const year = this.getYear(monthYear);

    // Set total days in month (for salary calc)
    this.total_days_in_month = new Date(year, month, 0).getDate();

    this.http.get<any>(`${this.API_URL}/salary-wizard`, {
      params: { month, year }
    }).subscribe((res) => {
      this.employeesWithAttendance = res.employees;
    });
  }

  // Update nextStep to handle null case
  // nextStep() {
  //   if (!this.selectedMonthYear) {
  //     console.error('No month selected');
  //     return;
  //   }

  //   if (this.wizardStep === 1) {
  //     this.fetchEmployeesWithAttendance(this.selectedMonthYear);
  //   } else if (this.wizardStep === 2) {
  //     //this.calculateSalaries(this.selectedMonthYear);
  //   }
  //   this.wizardStep++;
  // }

  // Add null check to calculateSalaries (if you use it)
  // calculateSalaries(monthYear: string | null) {
  //   if (!monthYear) {
  //     console.error('No month selected');
  //     return;
  //   }
    
  //   const month = this.getMonth(monthYear);
  //   const year = this.getYear(monthYear);

  //   this.http.post<any[]>(`${this.API_URL}/salaries/calculate`, {
  //     month,
  //     year
  //   }).subscribe((res) => {
  //     this.employeeSalaries = res;
  //   });
  // }

  // nextStep() {
  //   if (this.wizardStep === 1) {
  //     this.fetchEmployeesWithAttendance(this.selectedMonthYear);
  //   } else if (this.wizardStep === 2) {
  //     this.calculateSalaries(this.selectedMonthYear);
  //   }
  //   this.wizardStep++;
  // }

//   goToNext() {
//   this.validationForm1.get('month_year')?.setValue(this.selectedMonthYear);
//   this.validationForm1.markAllAsTouched();
  
//   if (this.validationForm1.valid) {
//     this.fetchEmployeesWithAttendance(this.selectedMonthYear);
//     this.wizardForm.goToNextStep();
//   }
// }

  // fetchEmployeesWithAttendance(monthYear: string) {
  //   const month = this.getMonth(monthYear);
  //   const year = this.getYear(monthYear);

  //   // Set total days in month (for salary calc)
  //   this.total_days_in_month = new Date(year, month, 0).getDate();

  //   this.http.get<any>(`${this.API_URL}/salary-wizard`, {
  //     params: { month, year }
  //   }).subscribe((res) => {
  //     this.employeesWithAttendance = res.employees;
  //   });
  // }

  // calculateSalaries(monthYear: string) {
  //   const month = this.getMonth(monthYear);
  //   const year = this.getYear(monthYear);

  //   this.http.post<any[]>(`${this.API_URL}/salaries/calculate`, {
  //     month,
  //     year
  //   }).subscribe((res) => {
  //     this.employeeSalaries = res;
  //   });
  // }

  goToStep(stepIndex: number) {
    this.wizardStep = stepIndex + 1; // Update the step counter if you're using it
    this.wizardForm.goToStep(stepIndex);
  }

  // Keep your existing goToNext() method for step 1
  goToNext() {
    this.submitted = true;
    this.validationForm1.get('month_year')?.setValue(this.selectedMonthYear);
    this.validationForm1.markAllAsTouched();
    
    if (this.validationForm1.valid) {
      this.fetchEmployeesWithAttendance(this.selectedMonthYear!);
      this.goToStep(1); // Go to step 2 (index 1)
    }
  }

  finish() {
    const payload = {
      salary_month: this.selectedMonthYear,
      total_employees: this.employeesWithAttendance.length,
      total_salary: this.getTotalSalary(),
      total_loan: this.getTotalLoan(),
      grand_total: this.getGrandTotal(),
      employees: this.employeesWithAttendance.map(emp => ({
        employee_id: emp.id,
        attendance_days: emp.attendance_days,
        salary: (emp.attendance_days / this.total_days_in_month) * emp.total_salary,
        loan_deduction: emp.loan_deduction
      }))
    };

    this.http.post(`${this.API_URL}/salary-summaries`, payload).subscribe({
      next: (res) => {
        this.router.navigate(['/reports/salaries']);
      },
      error: (err) => {
        console.error('Failed to save payroll summary');
      }
    });
  }

  // finish() {
  //   // Add any final submission logic here
  //   console.log('Process finished');
    
  //   this.router.navigate(['/report/salaries']);
  //   // You might want to:
  //   // 1. Submit the data
  //   // 2. Navigate to another page
  //   // 3. Show a success message
  //   // Example:
  //   // this.submitSalaries();
  //   // this.router.navigate(['/salaries']);
  // }

  getTotalSalary(): number {
    return this.employeesWithAttendance.reduce((total, emp) => {
      return total + ((emp.attendance_days / this.total_days_in_month) * emp.total_salary);
    }, 0);
  }

  getTotalLoan(): number {
    return this.employeesWithAttendance.reduce((total, emp) => {
      return total + emp.loan_deduction;
    }, 0);
  }

  getGrandTotal(): number {
    return this.getTotalSalary() - this.getTotalLoan();
  }

  // goBack() {
  //   this.wizardForm.goToStep(0); // Goes back to step 1 (index 0)
  // }

  // goNext() {
  //   this.wizardForm.goToStep(2); // Goes to step 3 (index 2)
  // }

  getMonth(monthYear: string) {
    return parseInt(monthYear.split('-')[1]);
  }

  getYear(monthYear: string) {
    return parseInt(monthYear.split('-')[0]);
  }

  // onMonthSelect(event: any) {
  //   this.selectedMonthYear = event.id;
  //   // Update the form control value when selection changes
  //   this.validationForm1.get('month_year')?.setValue(this.selectedMonthYear);
  // }

}
