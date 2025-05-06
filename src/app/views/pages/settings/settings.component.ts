import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../environments/environment';

interface AppSetting {
  company_name?: string;
  company_logo?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  private API_URL = environment.API_URL;
  private IMAGE_URL = environment.IMAGE_URL;

  isLoading = false;
  settings: { [key: string]: any } = {};
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadSetting();
  }

  loadSetting():void {
    this.http.get<any>(`${this.API_URL}/settings`).subscribe((data) => {
      this.settings = data;
  
      if (data['company_logo']) {
        this.imagePreview = `${this.IMAGE_URL}/${data['company_logo']}`;
      }
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
  
  // Add your onSubmit method
  submitSettings() {
    this.isLoading = true;
  
    const formData = new FormData();
    for (const key in this.settings) {
      if (this.settings.hasOwnProperty(key)) {
        formData.append(key, this.settings[key]);
      }
    }
  
    if (this.selectedFile) {
      formData.append('company_logo', this.selectedFile);
    }
  
    this.http.post(`${this.API_URL}/settings`, formData).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Settings saved successfully');
      },
      error: () => {
        this.isLoading = false;
        alert('Something went wrong');
      }
    });
  }  
  
}
