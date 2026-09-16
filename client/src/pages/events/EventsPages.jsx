import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';

export const EventsListPage = () => (
  <PlaceholderPage
    title="Campus Events & Workshops"
    description="Discover upcoming student activities, club meetups, hackathons, and guest lectures."
    module="Events"
    owner="Developer 1"
    routePath="/events"
  />
);

export const EventsDetailPage = () => (
  <PlaceholderPage
    title="Event Information & RSVP"
    description="Event schedule, venue, speaker details, and registration passes."
    module="Events"
    owner="Developer 1"
    routePath="/events/:id"
  />
);

export const EventsCreatePage = () => (
  <PlaceholderPage
    title="Create Campus Event"
    description="Publish an event, specify capacity limits, and open RSVPs to campus attendees."
    module="Events"
    owner="Developer 1"
    routePath="/events/create"
  />
);

export const EventsEditPage = () => (
  <PlaceholderPage
    title="Edit Event Details"
    description="Update time, room allocation, speaker notes, or attendee caps."
    module="Events"
    owner="Developer 1"
    routePath="/events/:id/edit"
  />
);

export const EventsMyEventsPage = () => (
  <PlaceholderPage
    title="My RSVPs & Hosted Events"
    description="Track events you are registered to attend or currently organizing."
    module="Events"
    owner="Developer 1"
    routePath="/events/my-events"
  />
);
