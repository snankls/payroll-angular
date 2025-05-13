import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    NgbDropdownModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private API_URL = environment.API_URL;
  private IMAGE_URL = environment.IMAGE_URL;
  
  currentRecord: any = {};
  loadingIndicator = true;
  isEditMode = false;
  image: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  rows: { id: number; [key: string]: any }[] = [];
  temp: { id: number; [key: string]: any }[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Handle id-based route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadUser(+id);
      }
    });
  }

  loadUser(id: number) {
    this.http.get<[]>(`${this.API_URL}/user/${id}`).subscribe({
      next: (user) => {
        this.currentRecord = {
          ...this.currentRecord,
          ...user,
        };

        // if (user.images?.image_name) {
        //   this.imagePreview = `${this.IMAGE_URL}/uploads/users/${user.images.image_name}`;
        // }
      },
      error: (error: HttpErrorResponse) => {
        
        if (error.status === 403 && error.error?.redirect) {
          // Unauthorized access - redirect to dashboard
          this.router.navigate(['/dashboard']);
        } else if (error.status === 404) {
        } else {
          console.error('Error isLoading user:', error);
        }
      }
    });
  }

  // loadUser(id: number) {
  //   this.http.get<[]>(`${this.API_URL}/user/${id}`).subscribe(user => {
  //     this.currentRecord = {
  //       ...this.currentRecord,
  //       ...user
  //     };
  
  //     // if (user.images && user.images.image_name) {
  //     //   this.imagePreview = `${this.IMAGE_URL}/uploads/users/${user.images.image_name}`;
  //     // }
  
  //     this.isEditMode = true;
  //   });
  // }

}
