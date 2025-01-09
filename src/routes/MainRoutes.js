import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import FinePerDay from 'views/Books/fine';
import BookAlloment from 'views/BookAllotment';
import View from 'views/view/view';
import PurchaseBook from 'views/purchaseBook/index';
import Profile from 'views/Profile';
import ViewBookAllotment from 'views/view/view.bookAllotment';
import ReceiveBook from 'views/ReceiveBook/index';
import StudentInvoice from 'views/view/invoiceStudent';
import ReceiveInvoice from 'views/view/receiveInvoiice';
import PurchaseInvoice from 'views/purchaseBook/purchaseInvoice';
import ImageGallery from 'views/Card/openImage';
import PrivateRoutes from './PrivateRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const LeadManagement = Loadable(lazy(() => import('views/Books')));
const ContactManagement = Loadable(lazy(() => import('views/Contact')));
const Call = Loadable(lazy(() => import('views/Register')));
const Policy = Loadable(lazy(() => import('views/Vendor')));
const Metting = Loadable(lazy(() => import('views/Publications')));
const Email = Loadable(lazy(() => import('views/Email')));
const Task = Loadable(lazy(() => import('views/Task')));
const EmailTemplates = Loadable(lazy(() => import('views/EmailTemplates')));
const Document = Loadable(lazy(() => import('views/Documents')));
const Calender = Loadable(lazy(() => import('views/Calender')));
const AddTemplates = Loadable(lazy(() => import('views/EmailTemplates/AddTemplates')));
const AddPurchaseBook = Loadable(lazy(() => import('views/purchaseBook/index')));
// const SubscriptionPage = Loadable(lazy(() => import('views/Subscription')));
const SubscriptionType = Loadable(lazy(() => import('views/subscriptionType/index')));
const Receive = Loadable(lazy(() => import('views/ReceiveBook/index')));
const Invoice = Loadable(lazy(() => import('views/view/invoiceStudent')));
// const ReceiveInvoice = Loadable(lazy(() => import('views/view/receiveInvoiice')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // {
    // path: '/',
    // element: <PrivateRoutes />,
    // children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'lead',
          element: <LeadManagement />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'receive',
          element: <ReceiveBook />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'fine',
          element: <FinePerDay />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'bookAllotment',
          element: <BookAlloment />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'contact',
          element: <ContactManagement />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'purchase',
          element: <PurchaseBook />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'call',
          element: <Call />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'policy',
          element: <Policy />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'policy',
          element: <Policy />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'task',
          element: <Task />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'email',
          element: <Email />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'meeting',
          element: <Metting />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'calender',
          element: <Calender />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'view/:id',
          element: <View />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'invoice/:id',
          element: <StudentInvoice />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'receiveInvoice/:id',
          element: <ReceiveInvoice />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'purchaseInvoice/:id',
          element: <PurchaseInvoice />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'viewBookAllotment/:id',
          element: <ViewBookAllotment />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'imageGallery/:id',
          element: <ImageGallery />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'document',
          element: <Document />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'emailtemplate',
          element: <EmailTemplates />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'emailtemplate/addTemplates',
          element: <AddTemplates />
        }
      ]
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'subscriptionType',
          element: <SubscriptionType />
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'profile',
          element: <Profile />
        }
      ]
    }
    // ]
    // }
  ]
};

export default MainRoutes;
