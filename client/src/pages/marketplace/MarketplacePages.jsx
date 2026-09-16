import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { MarketplaceListPage } from './MarketplaceListPage';
import { MarketplaceDetailPage } from './MarketplaceDetailPage';
import { MarketplaceCreatePage } from './MarketplaceCreatePage';

export { MarketplaceListPage, MarketplaceDetailPage, MarketplaceCreatePage };

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
