import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlist.service';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingIds, setPendingIds] = useState(new Set());

  // Fetch user's wishlist when authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const res = await wishlistService.getWishlist();
      setWishlistItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('[WishlistContext] Failed to fetch wishlist:', err.message);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, user?.id, user?._id]);

  // Set of wishlisted product IDs for fast O(1) checks
  const wishlistIds = useMemo(() => {
    const ids = new Set();
    wishlistItems.forEach((item) => {
      const id = item.id || item._id;
      if (id) ids.add(id.toString());
    });
    return ids;
  }, [wishlistItems]);

  /**
   * Check if a given product ID is in the wishlist
   * @param {String} productId
   * @returns {Boolean}
   */
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlistIds.has(productId.toString());
    },
    [wishlistIds]
  );

  /**
   * Toggle wishlist status for a product (Optimistic updates)
   * @param {Object|String} productOrId
   * @returns {Promise<Object>} { inWishlist: Boolean, requireAuth: Boolean }
   */
  const toggleWishlist = useCallback(
    async (productOrId) => {
      if (!isAuthenticated) {
        return { inWishlist: false, requireAuth: true };
      }

      const product = typeof productOrId === 'object' ? productOrId : null;
      const productId = (product ? product.id || product._id : productOrId)?.toString();

      if (!productId) return { inWishlist: false, requireAuth: false };

      const currentlyIn = wishlistIds.has(productId);
      const previousItems = [...wishlistItems];

      // Mark this product as undergoing async transition
      setPendingIds((prev) => new Set(prev).add(productId));

      // Optimistic UI update
      if (currentlyIn) {
        setWishlistItems((prev) =>
          prev.filter((item) => (item.id || item._id)?.toString() !== productId)
        );
      } else if (product) {
        setWishlistItems((prev) => [product, ...prev]);
      }

      try {
        if (currentlyIn) {
          const res = await wishlistService.removeFromWishlist(productId);
          if (Array.isArray(res.data)) {
            setWishlistItems(res.data);
          }
          return { inWishlist: false, requireAuth: false };
        } else {
          const res = await wishlistService.addToWishlist(productId);
          if (Array.isArray(res.data)) {
            setWishlistItems(res.data);
          }
          return { inWishlist: true, requireAuth: false };
        }
      } catch (err) {
        // Rollback on failure
        console.error('[WishlistContext] Toggle failed:', err.message);
        setWishlistItems(previousItems);
        throw err;
      } finally {
        setPendingIds((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
      }
    },
    [isAuthenticated, wishlistIds, wishlistItems]
  );

  /**
   * Remove explicitly from wishlist
   * @param {String} productId
   */
  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!productId || !isAuthenticated) return;
      return await toggleWishlist(productId);
    },
    [isAuthenticated, toggleWishlist]
  );

  const value = {
    wishlistItems,
    wishlistIds,
    wishlistCount: wishlistItems.length,
    isLoading,
    pendingIds,
    isPending: (id) => pendingIds.has(id?.toString()),
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
