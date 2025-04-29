// assets

import {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconPlus,
  IconBook,
  IconBookmark,
  IconUserCheck,
  IconUser,
  IconCreditCard,
  IconHeart
} from '@tabler/icons';

// constant
const icons = {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconPlus,
  IconBook,
  IconBookmark,
  IconUserCheck,
  IconUser,
  IconCreditCard,
  IconHeart
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  title: 'Dashboard-Menu',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: '01',
      title: 'Books Management',
      type: 'collapse',
      url: '/dashboard/BookManagement',
      icon: icons.IconAntennaBars5,
      children: [
        {
          id: 'manage-Books',
          title: 'Manage Books',
          type: 'item',
          url: '/dashboard/BookManagement',
          breadcrumbs: false
        },
        {
          id: 'book-Allotment',
          title: 'Books Allotment',
          type: 'item',
          url: '/dashboard/bookAllotment',
          breadcrumbs: false
        },
        {
          id: 'History',
          title: 'Alloment History',
          type: 'item',
          url: '/dashboard/History',
          breadcrumbs: false
        },
        {
          id: 'Receive',
          title: 'Receive',
          type: 'item',
          url: '/dashboard/Receive',
          breadcrumbs: false
        }
      ]
    },
    {
      id: '02',
      title: 'Student Management',
      type: 'item',
      url: '/dashboard/Register',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },

    {
      id: '04',
      title: 'Favorite Students',
      type: 'item',
      url: '/dashboard/Favorite',
      icon: icons.IconHeart,
      breadcrumbs: false
    },
    {
      id: '05',
      title: 'Purchase Books',
      type: 'item',
      url: '/dashboard/purchase',
      icon: icons.IconBook,
      breadcrumbs: false
    },
    {
      id: '06',
      title: ' Vendor Management',
      type: 'item',
      url: '/dashboard/Vendor',
      icon: icons.IconNotebook,
      breadcrumbs: false
    },

    {
      id: '07',
      title: 'Publications',
      type: 'item',
      url: '/dashboard/Publications',
      icon: icons.IconUsers
    },

    {
      id: '11',
      title: 'Subscription Type',
      type: 'item',
      url: '/dashboard/SubscriptionType',
      icon: IconCreditCard,
      breadcrumbs: false
    },
    {
      id: '10',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/Report',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: '12',
      title: 'Profile',
      type: 'item',
      url: '/dashboard/profile',
      icon: icons.IconUser,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
