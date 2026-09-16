import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';

export const ClubsListPage = () => (
  <PlaceholderPage
    title="Campus Clubs & Organizations"
    description="Explore active student associations, cultural clubs, academic chapters, and sports teams."
    module="Clubs"
    owner="Developer 2"
    routePath="/clubs"
  />
);

export const ClubsDetailPage = () => (
  <PlaceholderPage
    title="Club Profile & Membership"
    description="Learn about mission goals, executive leadership, upcoming meetings, and how to join."
    module="Clubs"
    owner="Developer 2"
    routePath="/clubs/:id"
  />
);

export const ClubsCreatePage = () => (
  <PlaceholderPage
    title="Register New Student Club"
    description="Submit a new student organization charter for university approval."
    module="Clubs"
    owner="Developer 2"
    routePath="/clubs/create"
  />
);

export const ClubsEditPage = () => (
  <PlaceholderPage
    title="Manage Club Settings"
    description="Update club announcements, meeting schedules, officer rosters, and banner imagery."
    module="Clubs"
    owner="Developer 2"
    routePath="/clubs/:id/edit"
  />
);

export const ClubsMyClubsPage = () => (
  <PlaceholderPage
    title="My Club Memberships"
    description="Track clubs you belong to or lead as a student organizer."
    module="Clubs"
    owner="Developer 2"
    routePath="/clubs/my-clubs"
  />
);
