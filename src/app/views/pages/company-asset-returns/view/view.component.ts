import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgbDropdownModule, NgbNavContent, NgbNavModule, NgbTooltip, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

interface Employee {
  id?: number | null;
  full_name: string | null;
  issue_date: string;
  status: number | null;
  description?: string;
  slug?: string;
  employee?: {
    full_name: string;
  };
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    NgbNavModule,
    NgbNavContent,
    NgbNavOutlet,
    NgbDropdownModule,
    NgbTooltip
  ],
  templateUrl: './view.component.html'
})
export class CompanyAssetReturnsViewComponent {
  private API_URL = environment.API_URL;

  currentRecord: Employee = {
    full_name: null,
    issue_date: '',
    status: null,
    description: '',
    employee: {
      full_name: '',
    }
  };

  itemsList: {
    id: number;
    company_asset_id: number;
    asset_type_id: number;
    description: string;
    status: number;
    asset_type?: {
      name: string;
    };
  }[] = [];
  

  rows: any[] = [];
  loadingIndicator = false;
  company_asset_status: string = '';
  imagePreview: string | ArrayBuffer | null = null;

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
        this.loadCompanyAssets(+id);
      }
    });
  }

  loadCompanyAssets(id: number) {
    this.http.get<any>(`${this.API_URL}/company-assets/${id}`).subscribe(response => {
      this.currentRecord = response;
      
      // ✅ Assign items list
      this.itemsList = response.details || [];
    });
  }

}
