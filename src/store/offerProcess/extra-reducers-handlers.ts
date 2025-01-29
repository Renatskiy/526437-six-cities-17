import { PayloadAction } from '@reduxjs/toolkit';
import {OfferProcess} from '../../types/state-types';
import { TOffer, TOfferDetails, TReviewOffer } from '../../types/offer-types';

import { convertCitiesById } from '../../helpers/convert-cities-by-id';
import { setCities } from '../../helpers/set-cities';
import { toast } from 'react-toastify';
import {

  postComment,

} from '../actions/api-actions';

// Обработчики для extraReducers
export const handleFetchOffersFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TOffer[]>
) => {
  console.log(action);
  state.offers = convertCitiesById(action.payload);
  state.cityes = setCities();
  state.loaded = true;
};

export const handleFetchOffersRejected = (state: OfferProcess) => {
  state.offers = [];
  state.loaded = true;
};

export const handleFetchFavoriteOffersFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TOffer[]>
) => {
  state.favoriteOffers = action.payload;
};

export const handleFetchFavoriteOffersRejected = (state: OfferProcess) => {
  state.favoriteOffers = [];
};

export const handleFetchOfferFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TOfferDetails>
) => {
  state.currentOffer = action.payload;
  state.selectedCity = action.payload.city;
};

export const handleFetchOfferRejected = (state: OfferProcess) => {
  state.loaded = true;
};

export const handleFetchCommentsFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TReviewOffer[]>
) => {
  state.currentOfferComments = action.payload;
};

export const handleFetchNearByOffersFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TOffer[]>
) => {
  state.nearByOffers = action.payload.map((offer) => ({
    ...offer,
    location: { ...offer.location, id: offer.id },
  }));
};

export const handlePostCommentPending = (state: OfferProcess) => {
  state.commentPosted = true;
  state.commentPostedError = false;
};

export const handlePostCommentFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TReviewOffer>
) => {
  state.commentPostedError = false;
  state.commentPosted = false;
  toast('Комментарий успешно отправлен');
  state.currentOfferComments = [...state.currentOfferComments, action.payload];
};

export const handlePostCommentRejected = (
  state: OfferProcess,
  action: ReturnType<typeof postComment.rejected> // Типизация через ReturnType
) => {
  state.commentPosted = false;
  state.commentPostedError = true;

  // Достаем сообщение об ошибке из action.error
  const errorMessage = action.error.message || 'Ошибка отправки формы';
  toast(errorMessage);
};

export const handleFetchFavoriteStatusFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TOffer, string, { arg: { status: number } }>
) => {
  const { status } = action.meta.arg;
  const offer = state.offers.find((of) => of.id === action.payload.id);

  if (offer) {
    offer.isFavorite = action.payload.isFavorite;
  }

  if (status === 1) {
    state.favoriteOffers.push(action.payload as unknown as TOffer);
  } else if (status === 0) {
    state.favoriteOffers = state.favoriteOffers.filter((item) => item.id !== action.payload.id);
  }
};
