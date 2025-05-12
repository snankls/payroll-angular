import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../../environments/environment';

// interface User {
//   id?: number;
//   first_name: string;
//   last_name: string;
//   full_name?: string;
//   username: string;
//   email: string;
//   password: string,
//   confirm_password: string,
//   phone_number: string;
//   gender: string | null;
//   date_of_birth?: string | null;
//   city_id: number | null;
//   city_name: string | null;
//   status: number | null;
//   address: string;
//   image?: File | string | null;
//   image_url?: string;
//   slug?: string;
//   images?: {
//     image_name: string;
//   };
// }

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
  
  currentRecord: any = {
    // first_name: '',
    // last_name: '',
    // full_name: '',
    // username: '',
    // email: '',
    // password: '',
    // confirm_password: '',
    // phone_number: '',
    // gender: null,
    // date_of_birth: '',
    // city_id: null,
    // city_name: null,
    // status: null,
    // address: '',
    // image: ''
  };

  loadingIndicator = true;
  isEditMode = false;
  image: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  rows: { id: number; [key: string]: any }[] = [];
  temp: { id: number; [key: string]: any }[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    //private router: Router
  ) {}
  
  ngOnInit(): void {
    // Handle id-based route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchUsers(+id);
      }
    });
  }

  fetchUsers(id: number) {
    this.http.get<[]>(`${this.API_URL}/user/${id}`).subscribe(user => {
      this.currentRecord = {
        ...this.currentRecord,
        ...user
      };
  
      // if (user.images && user.images.image_name) {
      //   this.imagePreview = `${this.IMAGE_URL}/uploads/users/${user.images.image_name}`;
      // }
  
      this.isEditMode = true;
    });
  }

}
