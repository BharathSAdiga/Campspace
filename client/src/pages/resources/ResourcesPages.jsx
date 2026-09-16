import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';

export const ResourcesListPage = () => (
  <PlaceholderPage
    title="Resource Allocation & Booking"
    description="Book campus study rooms, equipment, hardware kits, and laboratory spaces."
    module="Resources"
    owner="Developer 2"
    routePath="/resources"
  />
);

export const ResourcesDetailPage = () => (
  <PlaceholderPage
    title="Resource Details & Availability"
    description="Inspect equipment specifications, room capacities, and reservation time slots."
    module="Resources"
    owner="Developer 2"
    routePath="/resources/:id"
  />
);

export const ResourcesCreatePage = () => (
  <PlaceholderPage
    title="Register Campus Resource"
    description="Add a lab room or department asset to the campus booking directory."
    module="Resources"
    owner="Developer 2"
    routePath="/resources/create"
  />
);

export const ResourcesMyBookingsPage = () => (
  <PlaceholderPage
    title="My Active Bookings"
    description="Manage upcoming room reservations and equipment borrow checkouts."
    module="Resources"
    owner="Developer 2"
    routePath="/resources/my-bookings"
  />
);
