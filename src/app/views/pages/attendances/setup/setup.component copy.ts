import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@siemens/ngx-datatable';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../../environments/environment';
import { NgSelectComponent as MyNgSelectComponent } from '@ng-select/ng-select';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Employee {
  id?: number | null;
  employee_id: string | null;
  attendance_date: string | NgbDateStruct;
  description?: string;
  status: string;
  joining_date?: string;
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
    NgbTimepickerModule,
    FullCalendarModule
  ],
  templateUrl: './setup.component.html'
})
export class AttendancesSetupComponent {
  private API_URL = environment.API_URL;
  
  @ViewChild('attendanceModal') attendanceModal!: TemplateRef<any>;

  currentRecord: Employee = {
    employee_id: null,
    attendance_date: '',
    status: '',
  };
  
  selected: number[] = [];
  selectedRows: number[] = [];
  globalError: string = '';
  isEditMode = false;
  isLoading = false;
  errorMessage: any;
  formErrors: any = {};
  employees: any[] = [];
  employeeJoiningDate: Date | null = null;
  status: { id: string; name: string }[] = [];

  showPopup: boolean = false;
  selectedDate: string | null = null;
  selectedStatus: string = '';
  checkInTime = { hour: 9, minute: 0 };
  checkOutTime = { hour: 17, minute: 0 };
  duration: string = '8h 0m';
  minSelectableDate: Date | null = null;

  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;

//   calendarOptions: CalendarOptions = {
//     plugins: [
//       dayGridPlugin,
//       timeGridPlugin,
//       listPlugin,
//       interactionPlugin
//     ],
//     headerToolbar: {
//       left: 'prev,today,next',
//       center: 'title',
//       right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
//     },
//     initialView: 'dayGridMonth',
//     weekends: true,
//     editable: true,
//     selectable: true,
//     selectMirror: true,
//     dayMaxEvents: true,
//     select: this.handleDateSelect.bind(this),
//     eventClick: this.handleEventClick.bind(this),
//     eventsSet: this.handleEvents.bind(this),
// //    datesSet: this.handleCalendarReady.bind(this) // Add this line
//   };
  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      interactionPlugin
    ],
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    // Initialize with no selection allowed until employee is selected
    selectAllow: () => false
  };
  currentEvents: EventApi[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  time_in = {hour: 13, minute: 30};
  time_out = {hour: 13, minute: 30};
  // timeWithSeconds = {hour: 13, minute: 30, second: 20};

  // defaultTimepickerCode: any;
  private calendarApi: any;
  ngOnInit(): void {
    this.fetchEmployees();
    this.setDefaultIssueDate();

    this.status = [
      { id: 'Present', name: 'Present' },
      { id: 'Absent', name: 'Absent' },
      { id: 'Late', name: 'Late' },
      { id: 'Half Day', name: 'Half Day' },
    ];

    // Handle id-based route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCompanyAssets(+id);
      }
    });
  }

  fetchEmployees(): void {
    this.http.get<any[]>(`${this.API_URL}/active/employees`).subscribe({
      next: (response) => {
        // Map each employee to add a custom label
        this.employees = response.map((employee) => ({
          ...employee,

          joining_date: employee.joining_date ? new Date(employee.joining_date) : null
        }));
      },
      error: (error) => console.error('Failed to fetch employees:', error)
    });
  }

  // Add this method to update calendar selectable dates
  updateCalendarSelectableDates(joiningDate: Date): void {
    this.minSelectableDate = joiningDate;
    this.calendarOptions.selectAllow = (selectInfo) => {
      const selectedDate = new Date(selectInfo.startStr);
      return this.minSelectableDate ? selectedDate >= this.minSelectableDate : true;
    };
    
    // Refresh the calendar if it's already initialized
    if (this.calendarApi) {
      this.calendarApi.render();
    }
  }

  // Modify your ng-select change handler
  onEmployeeChange(employeeId: number): void {
    this.clearError('employee_id');
    
    // Find the selected employee
    const selectedEmployee = this.employees.find(e => e.id === employeeId);
    
    if (selectedEmployee && selectedEmployee.joining_date) {
      // Create date at start of day (midnight) to avoid timezone issues
      const joiningDate = new Date(selectedEmployee.joining_date);
      joiningDate.setHours(0, 0, 0, 0);
      this.employeeJoiningDate = joiningDate;
      
      // Update calendar options
      this.calendarOptions.selectAllow = (selectInfo) => {
        const selectedDate = new Date(selectInfo.startStr);
        selectedDate.setHours(0, 0, 0, 0); // Normalize to midnight
        return selectedDate >= joiningDate;
      };
      
      // Force calendar to refresh
      if (this.calendarApi) {
        this.calendarApi.setOption('selectAllow', this.calendarOptions.selectAllow);
      }
    } else {
      this.employeeJoiningDate = null;
      this.calendarOptions.selectAllow = undefined;
      if (this.calendarApi) {
        this.calendarApi.setOption('selectAllow', undefined);
      }
    }
  }  

  handleCalendarReady({ view, calendar }: { view: any, calendar: any }) {
    this.calendarApi = calendar;
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  
  // Update the handleDateSelect method
  handleDateSelect(selectInfo: DateSelectArg) {
    if (!this.currentRecord.employee_id) {
      alert('Please select an employee before marking attendance.');
      selectInfo.view.calendar.unselect();
      return;
    }
  
    const selectedDate = new Date(selectInfo.startStr);
    selectedDate.setHours(0, 0, 0, 0); // Normalize to midnight
  
    // Double-check the date restriction (in case selectAllow didn't catch it)
    if (this.employeeJoiningDate && selectedDate < this.employeeJoiningDate) {
      alert(`Cannot mark attendance before employee's joining date: ${this.employeeJoiningDate.toLocaleDateString()}`);
      selectInfo.view.calendar.unselect();
      return;
    }
  
    // Rest of your existing code...
    this.selectedDate = selectInfo.startStr;
    this.selectedStatus = '';
    this.checkInTime = { hour: 9, minute: 0 };
    this.checkOutTime = { hour: 17, minute: 0 };
    this.duration = '8h 0m';
  
    this.modalService.open(this.attendanceModal).result.then(
      (result) => {
        // Modal closed with Save
      },
      (reason) => {
        // Modal dismissed
        selectInfo.view.calendar.unselect();
      }
    );
  }

  // Add these new methods
  closePopup(): void {
    this.showPopup = false;
    this.selectedDate = null;
  }

  // Update saveAttendance method
  saveAttendance(modal: any): void {
    if (!this.selectedStatus) {
      alert('Please select a status');
      return;
    }

    this.calculateDuration();

    const attendanceData = {
      employee_id: this.currentRecord.employee_id,
      date: this.selectedDate,
      status: this.selectedStatus,
      check_in: `${this.checkInTime.hour}:${this.checkInTime.minute}`,
      check_out: this.checkOutTime ? `${this.checkOutTime.hour}:${this.checkOutTime.minute}` : null,
      duration: this.duration
    };
    
    // Here you would typically send to your backend API
    // this.http.post(`${this.API_URL}/attendance`, attendanceData).subscribe(...)

    // Add event to calendar
    this.addCalendarEvent(attendanceData);
    
    // Close the modal
    modal.close();
  }

  private addCalendarEvent(attendance: any): void {
    if (!this.calendarApi) {
      console.error('Calendar API not available');
      return;
    }
  
    let eventTitle = `${attendance.status}`;
    if (attendance.check_in) {
      eventTitle += ` (In: ${attendance.check_in})`;
    }
    if (attendance.check_out) {
      eventTitle += ` (Out: ${attendance.check_out})`;
    }
  
    let backgroundColor = '#28a745'; // Green for Present
    if (attendance.status === 'Absent') backgroundColor = '#dc3545';
    if (attendance.status === 'Leave') backgroundColor = '#17a2b8';
    if (attendance.status === 'Late') backgroundColor = '#ffc107';
    if (attendance.status === 'Half Day') backgroundColor = '#fd7e14';
  
    this.calendarApi.addEvent({
      id: createEventId(),
      title: eventTitle,
      start: attendance.date,
      allDay: true,
      backgroundColor: backgroundColor,
      borderColor: backgroundColor
    });
  }
  
    // Store the selected date
    // this.selectedDate = selectInfo.startStr;
  
    // // Reset popup form values
    // this.selectedStatus = '';
    // this.checkInTime = { hour: 9, minute: 0 };
    // this.checkOutTime = { hour: 17, minute: 0 };
    // this.duration = '';
  
    // // Show the popup form
    // this.showPopup = true;
  
    // // Unselect date on calendar
    // selectInfo.view.calendar.unselect();
  //}

  // submitAttendance() {
  //   if (!this.selectedDate || !this.status) {
  //     alert('Please fill all required fields.');
  //     return;
  //   }
  
  //   const attendanceRecord = {
  //     employee_id: this.currentRecord.employee_id,
  //     date: this.selectedDate,
  //     status: this.status,
  //     check_in: this.checkInTime,
  //     check_out: this.checkOutTime,
  //     duration: this.duration
  //   };
  
  //   // TODO: send to backend API
  
  //   this.showPopup = false;
  // }  

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  calculateDuration(): void {
    const start = new Date();
    const end = new Date();
  
    start.setHours(this.checkInTime.hour, this.checkInTime.minute, 0);
    end.setHours(this.checkOutTime.hour, this.checkOutTime.minute, 0);
  
    const diffMs = end.getTime() - start.getTime();
  
    if (diffMs > 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      this.duration = `${hours}h ${minutes}m`;
    } else {
      this.duration = '0h 0m';
    }
  }

  

  setDefaultIssueDate(): void {
    const today = new Date();
    this.currentRecord.attendance_date = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  }

  parseDate(dateString: string): NgbDateStruct {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day };
  }

  clearError(field: string): void {
    if (this.formErrors[field]) {
      delete this.formErrors[field];
    }
  }

  formatDate(date: NgbDateStruct | string | undefined): string {
    if (typeof date === 'string') return date;
    if (!date) return '';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  loadCompanyAssets(id: number) {
    this.http.get<any>(`${this.API_URL}/company-assets/${id}`).subscribe(response => {
      this.currentRecord = response;
  
      // ✅ Convert attendance_date string to NgbDateStruct
      if (typeof this.currentRecord.attendance_date === 'string') {
        this.currentRecord.attendance_date = this.parseDate(this.currentRecord.attendance_date);
      }
  
      this.isEditMode = true;
    });
  }  
  
  // Add your onSubmit method
  onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading = true;
  
    const formData = new FormData();
    formData.append('employee_id', String(this.currentRecord.employee_id));
    formData.append('attendance_date', this.formatDate(this.currentRecord.attendance_date));
    formData.append('description', this.currentRecord.description || '');
  
    this.http.post(`${this.API_URL}/company-assets`, formData).subscribe({
      next: () => {
        this.isLoading = false;
        // Optionally navigate
        this.router.navigate(['/company-assets']);
      },
      error: (error) => {
        this.isLoading = false;
        this.formErrors = error.error.errors || {};
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }  
  
  updateRecord(event: Event): void {
    event.preventDefault();
    this.isLoading = true;
    this.globalError = '';
  
    const formData = new FormData();
    formData.append('_method', 'PUT'); // simulate PUT for Laravel
    formData.append('id', String(this.currentRecord.id));
    formData.append('employee_id', String(this.currentRecord.employee_id));
    formData.append('attendance_date', this.formatDate(this.currentRecord.attendance_date));
    formData.append('description', this.currentRecord.description || '');
  
    this.http.post(`${this.API_URL}/company-assets/${String(this.currentRecord.id)}`, formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/company-assets']);
      },
      error: (error) => {
        this.isLoading = false;
        this.formErrors = error.error.errors || {};
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }  

  // // Add this error handling method
  // private handleError(error: any): void {
  //   if (error.error?.errors) {
  //     // Format errors to match what the template expects
  //     this.formErrors = error.error.errors;
  //   } else if (error.error?.message) {
  //     this.errorMessage = error.error.message;
  //   } else {
  //     this.errorMessage = 'An unknown error occurred';
  //   }
    
  //   // Scroll to the first error
  //   setTimeout(() => {
  //     const firstErrorElement = document.querySelector('.text-danger');
  //     if (firstErrorElement) {
  //       firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     }
  //   }, 100);
  // }

  // // Convert to yyyy-mm-dd string for backend
  // private formatDateForBackend(date: NgbDateStruct | string | undefined): string | null {
  //   if (!date) return null;
    
  //   // If already a string, return it directly
  //   if (typeof date === 'string') return date;
    
  //   // If NgbDateStruct, format it
  //   return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
  // }

}
