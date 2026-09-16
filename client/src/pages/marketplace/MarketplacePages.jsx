import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { MarketplaceListPage } from './MarketplaceListPage';

export { MarketplaceListPage };

export const MarketplaceDetailPage = () => (
  <PlaceholderPage
    title="Listing Details"
    description="View detailed product description, seller credentials, price, and contact information."
    module="Marketplace"
    owner="Developer 1"
    routePath="/marketplace/:id"
  />
);

export const MarketplaceCreatePage = () => (
  <PlaceholderPage
    title="Post New Listing"
    description="Publish an item or textbook for sale to verified campus peers."
    module="Marketplace"
    owner="Developer 1"
    routePath="/marketplace/create"
  />
);

export const MarketplaceEditPage = () => (
  <PlaceholderPage
    title="Edit Listing"
    description="Update pricing, condition, details, or availability status of your listing."
    module="Marketplace"
    owner="Developer 1"
    routePath="/marketplace/:id/edit"
  />
);

export const MarketplaceMyListingsPage = () => (
  <PlaceholderPage
    title="My Listings"
    description="Manage your active, reserved, and sold campus marketplace postings."
    module="Marketplace"
    owner="Developer 1"
    routePath="/marketplace/my-listings"
  />
);

export const MarketplaceWishlistPage = () => (
  <PlaceholderPage
    title="Saved Wishlist"
    description="Track saved items and price alerts across the campus marketplace."
    module="Marketplace"
    owner="Developer 1"
    routePath="/marketplace/wishlist"
  />
);
