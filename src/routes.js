import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DriverRequestDetails = React.lazy(() => import('./views/dashboard/DriverRequestDetails'))
const Users = React.lazy(() => import('./views/users/Users'))
const UserProfile = React.lazy(() => import('./views/users/UserProfile'))
const Drivers = React.lazy(() => import('./views/drivers/Drivers'))
const DriverProfile = React.lazy(() => import('./views/drivers/DriverProfile'))
const Vendors = React.lazy(() => import('./views/vendors/Vendors'))
const VendorProfile = React.lazy(() => import('./views/vendors/VendorProfile'))
const Transactions = React.lazy(() => import('./views/transactions/Transactions'))
const TransactionDetails = React.lazy(() => import('./views/transactions/TransactionDetails'))
const Rides = React.lazy(() => import('./views/rides/Rides'))
const RideDetails = React.lazy(() => import('./views/rides/RideDetails'))
const Reviews = React.lazy(() => import('./views/reviews/Reviews'))
const ReviewDetails = React.lazy(() => import('./views/reviews/ReviewDetails'))
const Disputes = React.lazy(() => import('./views/disputes/Disputes'))
const DisputeDetails = React.lazy(() => import('./views/disputes/DisputeDetails'))
const DisputeChat = React.lazy(() => import('./views/disputes/DisputeChat'))
const Timelog = React.lazy(() => import('./views/timelog/Timelog'))
const Settings = React.lazy(() => import('./views/settings/Settings'))
const ChangePassword = React.lazy(() => import('./views/change-password/ChangePassword'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/driver-requests/:id', name: 'Driver Request Details', element: DriverRequestDetails },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/:id', name: 'User Profile', element: UserProfile },
  { path: '/drivers', name: 'Drivers', element: Drivers },
  { path: '/drivers/:id', name: 'Driver Profile', element: DriverProfile },
  { path: '/vendors', name: 'Vendors', element: Vendors },
  { path: '/vendors/:id', name: 'Vendor Profile', element: VendorProfile },
  { path: '/transactions', name: 'Transactions', element: Transactions },
  { path: '/transactions/:id', name: 'Transaction Details', element: TransactionDetails },
  { path: '/rides', name: 'Rides', element: Rides },
  { path: '/rides/:id', name: 'Ride Details', element: RideDetails },
  { path: '/reviews', name: 'Reviews', element: Reviews },
  { path: '/reviews/:id', name: 'Review Details', element: ReviewDetails },
  { path: '/disputes', name: 'Disputes', element: Disputes },
  { path: '/disputes/:id', name: 'Dispute Details', element: DisputeDetails },
  { path: '/disputes/chat/:driverId', name: 'Dispute Chat', element: DisputeChat },
  { path: '/timelog', name: 'Timelog', element: Timelog },
  { path: '/settings', name: 'Settings', element: Settings },
{path : '/change-password', name: 'Change Password', element: ChangePassword},

]

export default routes
