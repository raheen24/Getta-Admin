import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users/Users'))
const UserProfile = React.lazy(() => import('./views/users/UserProfile'))
const Drivers = React.lazy(() => import('./views/drivers/Drivers'))
const DriverProfile = React.lazy(() => import('./views/drivers/DriverProfile'))
const Vendors = React.lazy(() => import('./views/vendors/Vendors'))
const VendorProfile = React.lazy(() => import('./views/vendors/VendorProfile'))
const Transactions = React.lazy(() => import('./views/transactions/Transactions'))
const Rides = React.lazy(() => import('./views/rides/Rides'))
const RideDetails = React.lazy(() => import('./views/rides/RideDetails'))
const Reviews = React.lazy(() => import('./views/reviews/Reviews'))
const Disputes = React.lazy(() => import('./views/disputes/Disputes'))
const Reports = React.lazy(() => import('./views/reports/Reports'))
const ReportDetails = React.lazy(() => import('./views/reports/ReportDetails'))
const Settings = React.lazy(() => import('./views/settings/Settings'))
const ContentManagement = React.lazy(() => import('./views/content-management/ContentManagement'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/:id', name: 'User Profile', element: UserProfile },
  { path: '/drivers', name: 'Drivers', element: Drivers },
  { path: '/drivers/:id', name: 'Driver Profile', element: DriverProfile },
  { path: '/vendors', name: 'Vendors', element: Vendors },
  { path: '/vendors/:id', name: 'Vendor Profile', element: VendorProfile },
  { path: '/transactions', name: 'Transactions', element: Transactions },
  { path: '/rides', name: 'Rides', element: Rides },
  { path: '/rides/:id', name: 'Ride Details', element: RideDetails },
  { path: '/reviews', name: 'Reviews', element: Reviews },
  { path: '/disputes', name: 'Disputes', element: Disputes },
  { path: '/reports', name: 'Reports', element: Reports },
  { path: '/reports/:id', name: 'Report Details', element: ReportDetails },
  { path: '/settings', name: 'Settings', element: Settings },
  { path: '/content-management', name: 'Content Management', element: ContentManagement },

]

export default routes
