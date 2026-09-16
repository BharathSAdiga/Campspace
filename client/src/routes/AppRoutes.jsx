import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/common';
import {
  LandingPage,
  NotFoundPage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  MarketplaceListPage,
  MarketplaceDetailPage,
  MarketplaceCreatePage,
  MarketplaceEditPage,
  MarketplaceMyListingsPage,
  MarketplaceWishlistPage,
  EventsListPage,
  EventsDetailPage,
  EventsCreatePage,
  EventsEditPage,
  EventsMyEventsPage,
  ResourcesListPage,
  ResourcesDetailPage,
  ResourcesCreatePage,
  ResourcesMyBookingsPage,
  ClubsListPage,
  ClubsDetailPage,
  ClubsCreatePage,
  ClubsEditPage,
  ClubsMyClubsPage,
  FolioLandingPage,
} from '../pages';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Standalone Folio Landing Page */}
      <Route path="/folio" element={<FolioLandingPage />} />

      <Route element={<MainLayout />}>
        {/* Core & Overview */}
        <Route path="/" element={<LandingPage />} />

        {/* Shared: Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Shared: Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Developer 1: Marketplace */}
        <Route path="/marketplace" element={<MarketplaceListPage />} />
        <Route
          path="/marketplace/create"
          element={
            <ProtectedRoute>
              <MarketplaceCreatePage />
            </ProtectedRoute>
          }
        />
        <Route path="/marketplace/my-listings" element={<MarketplaceMyListingsPage />} />
        <Route path="/marketplace/wishlist" element={<MarketplaceWishlistPage />} />
        <Route path="/marketplace/:id/edit" element={<MarketplaceEditPage />} />
        <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />

        {/* Developer 1: Events */}
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/create" element={<EventsCreatePage />} />
        <Route path="/events/my-events" element={<EventsMyEventsPage />} />
        <Route path="/events/:id/edit" element={<EventsEditPage />} />
        <Route path="/events/:id" element={<EventsDetailPage />} />

        {/* Developer 2: Resources Allocation */}
        <Route path="/resources" element={<ResourcesListPage />} />
        <Route path="/resources/create" element={<ResourcesCreatePage />} />
        <Route path="/resources/my-bookings" element={<ResourcesMyBookingsPage />} />
        <Route path="/resources/:id" element={<ResourcesDetailPage />} />

        {/* Developer 2: Clubs & Organizations */}
        <Route path="/clubs" element={<ClubsListPage />} />
        <Route path="/clubs/create" element={<ClubsCreatePage />} />
        <Route path="/clubs/my-clubs" element={<ClubsMyClubsPage />} />
        <Route path="/clubs/:id/edit" element={<ClubsEditPage />} />
        <Route path="/clubs/:id" element={<ClubsDetailPage />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
