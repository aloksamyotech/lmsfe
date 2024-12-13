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
  // AddTaskIcon,
  IconPlus,
  IconBook,
  IconBookmark,
  IconUserCheck,
  IconUser,
  IconCreditCard
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
  // AddTaskIcon,
  IconPlus,
  IconBook,
  IconBookmark,
  IconUserCheck,
  IconUser,
  IconCreditCard
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
      url: '/dashboard/lead',
      icon: icons.IconAntennaBars5,
      // breadcrumbs: false
      children: [
        {
          id: 'manage-Books',
          title: 'Manage Books',
          type: 'item',
          url: '/dashboard/lead',
          breadcrumbs: false
        },
        {
          id: 'book-Allotment',
          title: 'Books Allotment',
          type: 'item',
          url: '/dashboard/bookAllotment',
          // icon: icons.IconPlus
          // icon: icons.IconBookmark
          breadcrumbs: false
        },
        {
          id: 'receive-Books',
          title: 'Receive Books',
          type: 'item',
          url: '/dashboard/receive',
          breadcrumbs: false
        }
        // {
        //   id: 'update-Fine',
        //   title: 'Manage Fine',
        //   type: 'item',
        //   url: '/dashboard/fine',
        //   breadcrumbs: false
        // }
      ]
    },
    {
      id: '02',
      title: 'Student Management',
      type: 'item',
      url: '/dashboard/call',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    // {
    //   id: '03',
    //   title: 'Book Allotment',
    //   type: 'item',
    //   url: '/dashboard/bookAllotment',
    //   // icon: icons.IconPlus
    //   icon: icons.IconBookmark
    // },
    {
      id: '04',
      title: 'Favorite Contact',
      type: 'item',
      url: '/dashboard/contact',
      icon: icons.IconPhoneCheck,
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
      url: '/dashboard/policy',
      icon: icons.IconNotebook,
      breadcrumbs: false
    },
    // {
    //   id: '04',
    //   title: 'Request New Book',
    //   type: 'collapse',
    //   // url: '/dashboard/task',
    //   icon: icons.IconChecklist,
    //   children: [
    //     {
    //       id: 'add-New-Book',
    //       title: 'Add New Book',
    //       type: 'item',
    //       url: 'dashboard/task',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'manage-New-Book',
    //       title: 'Manage New Book',
    //       type: 'item',
    //       url: '/dashboard/task',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    {
      id: '07',
      title: 'Publications',
      // type: 'collapse',
      type: 'item',
      url: '/dashboard/meeting',
      icon: icons.IconUsers

      // children: [
      //   {
      //     id: 'add-Publications',
      //     title: 'Add Publications',
      //     // type: 'item',
      //     url: '/dashboard/meeting',
      //     breadcrumbs: false
      //   },
      //   {
      //     id: 'manage-Publications',
      //     title: 'Manage Publications',
      //     type: 'item',
      //     url: '/dashboard/meeting',
      //     breadcrumbs: false
      //   }
      // ]
    },

    // {
    //   id: '07',
    //   title: 'Emails',
    //   type: 'item',
    //   url: '/dashboard/email',
    //   icon: icons.IconMail,
    //   breadcrumbs: false
    // },
    // {
    //   id: '08',
    //   title: 'Reports',
    //   type: 'item',
    //   url: '/dashboard/report',
    //   icon: icons.IconCalendarEvent,
    //   breadcrumbs: false
    // },
    // {
    //   id: '09',
    //   title: 'Calender',
    //   type: 'item',
    //   url: '/dashboard/calender',
    //   icon: icons.IconCalendarEvent,
    //   breadcrumbs: false
    // }
    // {
    //   id: '09',
    //   title: 'Document Management',
    //   type: 'item',
    //   url: '/dashboard/document',
    //   icon: icons.IconFileUpload,
    //   breadcrumbs: false
    // },
    // {
    //   id: '09',
    //   title: 'view',
    //   type: 'item',
    //   url: '/dashboard/view/:id',
    //   icon: icons.IconFileUpload,
    //   breadcrumbs: false
    // },

    // {
    //   id: '11',
    //   title: 'Subscription',
    //   type: 'item',
    //   url: '/dashboard/Subscription',
    //   icon: IconCreditCard,
    //   breadcrumbs: false
    // },
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
      url: '/dashboard/emailtemplate',
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
