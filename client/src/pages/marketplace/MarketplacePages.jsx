import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';
import { MarketplaceListPage } from './MarketplaceListPage';
import { MarketplaceDetailPage } from './MarketplaceDetailPage';
import { MarketplaceCreatePage } from './MarketplaceCreatePage';
import { MarketplaceEditPage } from './MarketplaceEditPage';
import { MarketplaceMyListingsPage } from './MarketplaceMyListingsPage';

export {
  MarketplaceListPage,
  MarketplaceDetailPage,
  MarketplaceCreatePage,
  MarketplaceEditPage,
  MarketplaceMyListingsPage,
};

export const MarketplaceWishlistPage = () => (
  <PlaceholderPage
    title="Saved Wishlist"
    description="Track saved items and price alerts across the campus marketplace."
    module="Marketplace"
    owner="Developer 1"
    routePath="/marketplace/wishlist"
  />
);
