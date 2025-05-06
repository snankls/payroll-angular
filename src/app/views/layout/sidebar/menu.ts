import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard'
  },
  {
    label: 'Employees',
    isTitle: true
  },
  {
    label: 'Employees',
    icon: 'users',
    link: '/employees',
  },
  {
    label: 'Organizations',
    icon: 'codesandbox',
    subItems: [
      {
        label: 'Departments',
        link: '/organizations/departments',
      },
      {
        label: 'Designations',
        link: '/organizations/designations'
      },
      {
        label: 'Job Types',
        link: '/organizations/job-types'
      },
    ]
  },
  {
    label: 'Attendances',
    icon: 'calendar',
    link: '/attendances',
  },
  {
    label: 'Leave Applications',
    icon: 'mail',
    subItems: [
      {
        label: 'Leave Applications',
        link: '/leave-applications',
      },
      {
        label: 'Leave Types',
        link: '/leave-applications/leave-types'
      },
    ]
  },
  {
    label: 'Salary Wizards',
    icon: 'sunrise',
    link: '/salary-wizards',
  },
  {
    label: 'Reports',
    icon: 'file-text',
    subItems: [
      {
        label: 'Banks',
        link: '/reports/banks',
      },
      {
        label: 'Cities',
        link: '/reports/cities'
      },
      {
        label: 'Users',
        link: '/report/users'
      },
    ]
  },
  {
    label: 'Allowances / Benefits',
    isTitle: true
  },

  // Company Assets
  {
    label: 'Company Assets',
    icon: 'slack',
    subItems: [
      {
        label: 'Company Assets',
        link: '/company-assets',
      },
      {
        label: 'Assets Types',
        link: '/company-assets/asset-types'
      },
    ]
  },
  {
    label: 'Assets Return',
    icon: 'disc',
    link: '/company-asset-returns',
  },

  // General
  {
    label: 'General',
    isTitle: true
  },
  {
    label: 'Loans',
    icon: 'layers',
    link: '/loans',
  },
  {
    label: 'Bank A/C',
    icon: 'dollar-sign',
    link: '/banks',
  },
  {
    label: 'Cities',
    icon: 'map',
    link: '/cities',
  },
  {
    label: 'Users',
    icon: 'user',
    link: '/users',
  },
  {
    label: 'Settings',
    icon: 'settings',
    link: '/settings',
  },
];
