import { Routes } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      { path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./views/pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
        data: { title: 'Dashboard' },
        canActivate: [AuthGuard]
      },

      // Employees
      {
        path: 'employees',
        loadComponent: () => import('./views/pages/employees/employees.component').then(c => c.EmployeesComponent),
        data: { title: 'Employees' },
        canActivate: [AuthGuard]
      },

      // Employees Add
      {
        path: 'employees/add',
        loadComponent: () => import('./views/pages/employees/setup/setup.component').then(c => c.EmployeesSetupComponent),
        data: { title: 'Employees Add' },
        canActivate: [AuthGuard]
      },

      // Employees Edit
      {
        path: 'employees/edit/:id',
        loadComponent: () => import('./views/pages/employees/setup/setup.component').then(c => c.EmployeesSetupComponent),
        data: { title: 'Employees Edit' },
        canActivate: [AuthGuard]
      },

      // Employees View
      {
        path: 'employees/view/:id',
        loadComponent: () => import('./views/pages/employees/view/view.component').then(c => c.EmployeesViewComponent),
        data: { title: 'Employees View' },
        canActivate: [AuthGuard]
      },

      // Departments
      {
        path: 'organizations/departments',
        loadComponent: () => import('./views/pages/organizations/departments/departments.component').then(c => c.DepartmentsComponent),
        data: { title: 'Departments' },
        canActivate: [AuthGuard]
      },

      // Designations
      {
        path: 'organizations/designations',
        loadComponent: () => import('./views/pages/organizations/designations/designations.component').then(c => c.DesignationsComponent),
        data: { title: 'Designations' },
        canActivate: [AuthGuard]
      },

      // Job Types
      {
        path: 'organizations/job-types',
        loadComponent: () => import('./views/pages/organizations/job-types/job-types.component').then(c => c.JobTypesComponent),
        data: { title: 'Job Types' },
        canActivate: [AuthGuard]
      },

      // Attendances
      {
        path: 'attendances',
        loadComponent: () => import('./views/pages/attendances/attendances.component').then(c => c.AttendancesComponent),
        data: { title: 'Attendances' },
        canActivate: [AuthGuard]
      },

      // Attendances Add
      {
        path: 'attendances/add',
        loadComponent: () => import('./views/pages/attendances/add/add.component').then(c => c.AttendancesAddComponent),
        data: { title: 'Attendances Add' },
        canActivate: [AuthGuard]
      },

      // Attendances Edit
      {
        path: 'attendances/edit/:id',
        loadComponent: () => import('./views/pages/attendances/edit/edit.component').then(c => c.AttendancesEditComponent),
        data: { title: 'Attendances Edit' },
        canActivate: [AuthGuard]
      },

      // Attendances View
      {
        path: 'attendances/view/:id',
        loadComponent: () => import('./views/pages/attendances/view/view.component').then(c => c.AttendancesViewComponent),
        data: { title: 'Attendances View' },
        canActivate: [AuthGuard]
      },

      // Leave Applications
      {
        path: 'leave-applications',
        loadComponent: () => import('./views/pages/leave-applications/leave-applications.component').then(c => c.LeaveApplicationsComponent),
        data: { title: 'Leave Applications' },
        canActivate: [AuthGuard]
      },

      // Leave Types
      {
        path: 'leave-applications/leave-types',
        loadComponent: () => import('./views/pages/leave-applications/leave-types/leave-types.component').then(c => c.LeaveTypesComponent),
        data: { title: 'Leave Types' },
        canActivate: [AuthGuard]
      },

      // Salary Wizards
      {
        path: 'salary-wizards',
        loadComponent: () => import('./views/pages/salary-wizards/salary-wizards.component').then(c => c.SalaryWizardsComponent),
        data: { title: 'Salary Wizards' },
        canActivate: [AuthGuard]
      },

      // Reports
      {
        path: 'report/users',
        loadComponent: () => import('./views/pages/reports/users/users.component').then(c => c.ReportsUsersComponent),
        data: { title: 'Users Reports' },
        canActivate: [AuthGuard]
      },

      // Company Assets
      {
        path: 'company-assets',
        loadComponent: () => import('./views/pages/company-assets/company-assets.component').then(c => c.CompanyAssetsComponent),
        data: { title: 'Company Assets' },
        canActivate: [AuthGuard]
      },

      // Company Assets Add
      {
        path: 'company-assets/add',
        loadComponent: () => import('./views/pages/company-assets/setup/setup.component').then(c => c.CompanyAssetsSetupComponent),
        data: { title: 'Company Assets Add' },
        canActivate: [AuthGuard]
      },

      // Company Assets Edit
      {
        path: 'company-assets/edit/:id',
        loadComponent: () => import('./views/pages/company-assets/setup/setup.component').then(c => c.CompanyAssetsSetupComponent),
        data: { title: 'Company Assets Edit' },
        canActivate: [AuthGuard]
      },

      // Company Assets View
      {
        path: 'company-assets/view/:id',
        loadComponent: () => import('./views/pages/company-assets/view/view.component').then(c => c.CompanyAssetsViewComponent),
        data: { title: 'Company Assets View' },
        canActivate: [AuthGuard]
      },

      // Assets Types
      {
        path: 'company-assets/asset-types',
        loadComponent: () => import('./views/pages/company-assets/asset-types/asset-types.component').then(c => c.AssetTypesComponent),
        data: { title: 'Asset Types' },
        canActivate: [AuthGuard]
      },

      // Company Asset Returns
      {
        path: 'company-asset-returns',
        loadComponent: () => import('./views/pages/company-asset-returns/company-asset-returns.component').then(c => c.CompanyAssetRetunsComponent),
        data: { title: 'Company Asset Returns' },
        canActivate: [AuthGuard]
      },

      // Company Asset Returns Add
      {
        path: 'company-asset-returns/add',
        loadComponent: () => import('./views/pages/company-asset-returns/setup/setup.component').then(c => c.CompanyAssetsSetupComponent),
        data: { title: 'Company Asset Returns Add' },
        canActivate: [AuthGuard]
      },

      // Company Asset Returns Edit
      {
        path: 'company-asset-returns/edit/:id',
        loadComponent: () => import('./views/pages/company-asset-returns/setup/setup.component').then(c => c.CompanyAssetsSetupComponent),
        data: { title: 'Company Asset Returns Edit' },
        canActivate: [AuthGuard]
      },

      // Company Asset Returns View
      {
        path: 'company-asset-returns/view/:id',
        loadComponent: () => import('./views/pages/company-asset-returns/view/view.component').then(c => c.CompanyAssetReturnsViewComponent),
        data: { title: 'Company Asset Returns View' },
        canActivate: [AuthGuard]
      },

      // Loans
      {
        path: 'loans',
        loadComponent: () => import('./views/pages/loans/loans.component').then(c => c.LoansComponent),
        data: { title: 'loans' },
        canActivate: [AuthGuard]
      },

      // Loans Add
      {
        path: 'loans/add',
        loadComponent: () => import('./views/pages/loans/setup/setup.component').then(c => c.LoansSetupComponent),
        data: { title: 'Loans Add' },
        canActivate: [AuthGuard]
      },

      // Loans Edit
      {
        path: 'loans/edit/:id',
        loadComponent: () => import('./views/pages/loans/setup/setup.component').then(c => c.LoansSetupComponent),
        data: { title: 'Loans Edit' },
        canActivate: [AuthGuard]
      },

      // Loans View
      {
        path: 'loans/view/:id',
        loadComponent: () => import('./views/pages/loans/view/view.component').then(c => c.LoansViewComponent),
        data: { title: 'Loans View' },
        canActivate: [AuthGuard]
      },

      // Banks A/C
      {
        path: 'banks',
        loadComponent: () => import('./views/pages/banks/banks.component').then(c => c.BanksComponent),
        data: { title: 'Banks' },
        canActivate: [AuthGuard]
      },

      // Cities
      {
        path: 'cities',
        loadComponent: () => import('./views/pages/cities/cities.component').then(c => c.CitiesComponent),
        data: { title: 'Cities' },
        canActivate: [AuthGuard]
      },

      // Companies
      {
        path: 'companies',
        loadComponent: () => import('./views/pages/companies/companies.component').then(c => c.CompaniesComponent),
        data: { title: 'Companies' },
        canActivate: [AuthGuard]
      },

      // Users
      {
        path: 'users',
        loadComponent: () => import('./views/pages/users/users.component').then(c => c.UsersComponent),
        data: { title: 'Users' },
        canActivate: [AuthGuard]
      },

      // Users Add
      {
        path: 'users/add',
        loadComponent: () => import('./views/pages/users/setup/setup.component').then(c => c.UsersSetupComponent),
        data: { title: 'Users Add' },
        canActivate: [AuthGuard]
      },

      // Users Edit
      {
        path: 'users/edit/:id',
        loadComponent: () => import('./views/pages/users/setup/setup.component').then(c => c.UsersSetupComponent),
        data: { title: 'Users Edit' },
        canActivate: [AuthGuard]
      },

      // User Profile
      {
        path: 'users/profile/:id',
        loadComponent: () => import('./views/pages/users/profile/profile.component').then(c => c.ProfileComponent),
        data: { title: 'User Profile' },
        canActivate: [AuthGuard]
      },

      // Change Password
      {
        path: 'change-password',
        loadComponent: () => import('./views/pages/users/change-password/change-password.component').then(c => c.ChangePasswordComponent),
        data: { title: 'Change Password' },
        canActivate: [AuthGuard]
      },

      // 404 Page
      {
        path: 'error',
        loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent),
      },
      {
        path: 'error/:type',
        loadComponent: () => import('./views/pages/error/error.component').then(c => c.ErrorComponent)
      },
      { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
    ]
  },
];
