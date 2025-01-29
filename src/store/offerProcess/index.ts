import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, DEFAULT_CITY } from '../../constant';
import {OfferProcess} from '../../types/state-types';
import { TCity } from '../../types/city-types';

import {handleFetchOffersFulfilled,
  handleFetchOffersRejected,
  handleFetchFavoriteOffersFulfilled,
  handleFetchFavoriteOffersRejected,
  handleFetchOfferFulfilled,
  handleFetchOfferRejected,
  handleFetchCommentsFulfilled,
  handleFetchNearByOffersFulfilled,
  handlePostCommentPending,
  handlePostCommentFulfilled,
  handlePostCommentRejected,
  handleFetchFavoriteStatusFulfilled} from './extra-reducers-handlers';

import {
  fetchOffers,
  fetchFavoriteOffers,
  fetchOffer,
  fetchComments,
  fetchNearByOffers,
  postComment,
  fetchFavoriteStatus
} from '../actions/api-actions';


const initialState: OfferProcess = {
  loaded: false,
  commentPosted: false,
  commentPostedError: false,
  offers: [],
  cityes: [],
  favoriteOffers: [],
  nearByOffers: [],
  currentOffer: {},
  currentOfferComments: [],
  selectedCity: DEFAULT_CITY,
};

export const offerProcess = createSlice({
  name: NameSpace.Offer,
  initialState,
  reducers: {
    dispatchSelectedCity: (state, action: PayloadAction<TCity>) => {
      state.selectedCity = action.payload;
    },
    dispatchNearByOfferToFavorite: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const offer = state.nearByOffers.find((x) => x.id === id);
      if (offer) {
        offer.isFavorite = !offer?.isFavorite;
      }
    },
    dispatchRedirect: () => void {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.fulfilled, handleFetchOffersFulfilled)
      .addCase(fetchOffers.rejected, handleFetchOffersRejected)
      .addCase(fetchFavoriteOffers.fulfilled, handleFetchFavoriteOffersFulfilled)
      .addCase(fetchFavoriteOffers.rejected, handleFetchFavoriteOffersRejected)
      .addCase(fetchOffer.fulfilled, handleFetchOfferFulfilled)
      .addCase(fetchOffer.rejected, handleFetchOfferRejected)
      .addCase(fetchComments.fulfilled, handleFetchCommentsFulfilled)
      .addCase(fetchNearByOffers.fulfilled, handleFetchNearByOffersFulfilled)
      .addCase(postComment.pending, handlePostCommentPending)
      .addCase(postComment.fulfilled, handlePostCommentFulfilled)
      .addCase(postComment.rejected, handlePostCommentRejected)
      .addCase(fetchFavoriteStatus.fulfilled, handleFetchFavoriteStatusFulfilled);
  },
});

export const { dispatchSelectedCity, dispatchNearByOfferToFavorite, dispatchRedirect } =
  offerProcess.actions;
