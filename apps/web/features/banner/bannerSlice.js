import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Static fallback data used when the API is unreachable
const FALLBACK_BANNERS = [
  {
    id: 'fallback-1',
    type: 'offer',
    placement: 'Both',
    status: 'Active',
    title: 'late-night cravings. spicy satisfying. fiery crunch.',
    label: 'spicy cravings • 100% fiery flavor',
    description:
      'Elevate your evening snacking with Dunches. Our signature organic lotus seeds are popped, slow-roasted, and heavily dusted with spicy chilies and exotic herbs.',
    image: '/auth_visual.png',
    actionText: 'Shop the Sale',
    buttonLink: '/explore?category=Spicy',
    discountText: 'flat 15% off first order',
    code: 'CRUNCH15',
  },
  {
    id: 'fallback-2',
    type: 'offer',
    placement: 'Both',
    status: 'Active',
    title: 'pure himalayan salt. clean crunch. zero guilt.',
    label: 'classic series • simple premium',
    description:
      'Dunches Himalayan Pink Salt Makhana offers the clean, organic crunch of puffed lotus seeds dusted with hand-mined pink salt. Made with zero synthetic additives.',
    image: '/makhana_snack.jpg',
    actionText: 'Get Deal',
    buttonLink: '/product/classic-himalayan-pink-salt-makhana',
    discountText: 'buy 2 get 1 free',
    code: 'CLASSICBOGO',
  },
  {
    id: 'fallback-3',
    type: 'announcement',
    placement: 'Both',
    status: 'Active',
    title: 'savory sesame. black pepper. roasted gold.',
    label: 'product launch • newly added',
    description:
      'Introducing our Toasted Sesame & Black Pepper Makhana. Nutty sesame paste meets cracked black tellicherry peppercorns. Slow-roasted to perfection.',
    image: '/mughlai_dish_icon.png',
    actionText: 'Try New Flavor',
    buttonLink: '/product/toasted-sesame-black-pepper-makhana',
    discountText: 'high protein superfood',
    code: 'NEWLAUNCH',
  },
];

export const fetchBanners = createAsyncThunk(
  'banner/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/v1/banners?status=Active');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const banners = data?.data ?? [];
      // Map _id → id for consistency
      return banners.map((b) => ({ ...b, id: b._id ?? b.id }));
    } catch {
      return rejectWithValue('unavailable');
    }
  }
);

const bannerSlice = createSlice({
  name: 'banner',
  initialState: {
    items: [],
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        // Use API data if we got any, otherwise keep fallback
        state.items = action.payload.length > 0 ? action.payload : FALLBACK_BANNERS;
      })
      .addCase(fetchBanners.rejected, (state) => {
        state.loading = false;
        state.fetched = true;
        state.items = FALLBACK_BANNERS;
      });
  },
});

export default bannerSlice.reducer;

// ── Selectors ──────────────────────────────────────────────────────────────────
export const selectAllBanners = (state) => state.banner.items;
export const selectBannersLoading = (state) => state.banner.loading;
export const selectBannersFetched = (state) => state.banner.fetched;

/** Banners for the desktop Hero Slider */
export const selectHeroBanners = createSelector(
  [selectAllBanners],
  (items) => items.filter((b) => b.placement === 'Hero Slider' || b.placement === 'Both')
);

/** Banners for the mobile Promo Carousel */
export const selectPromoBanners = createSelector(
  [selectAllBanners],
  (items) => items.filter((b) => b.placement === 'Mobile Promo' || b.placement === 'Both')
);
