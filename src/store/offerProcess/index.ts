import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace} from '../../constant';
import {OfferProcess} from '../../types/state-types';
import {fetchOffers,
  fetchFavoriteOffers,
  fetchOffer,
  fetchComments,
  fetchNearByOffers,
  postComment,
  fetchFavoriteStatus} from '../actions/api-actions';
import {convertCitiesById} from '../../helpers/convert-cities-by-id';
import {setCities} from '../../helpers/set-cities';
import { TCity } from '../../types/city-types';
import { toast } from 'react-toastify';
import { TOffer, TOfferDetails, TReviewOffer } from '../../types/offer-types';

const initialState: OfferProcess = {
  loaded: false,
  commentPosted: false,
  commentPostedError: false,
  offers: [],
  cityes: [],
  favoriteOffers: [],
  nearByOffers: [],
  currentOffer: {},
  currentOfferComments: [] ,
  selectedCity: {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13,
    },
  },
};

// Функция для обновления состояния после успешного получения предложений
const handleFetchOffersFulfilled = (state: OfferProcess, action: PayloadAction<TOffer[]>) => {
  const offers = convertCitiesById(action.payload);
  const cityes = setCities();
  state.offers = offers;
  state.cityes = cityes;
  state.loaded = true;
};

// Функция для обновления состояния после успешного получения текущего предложения
const handleFetchOfferFulfilled = (state: OfferProcess, action: PayloadAction<TOfferDetails>) => {
  state.currentOffer = action.payload;
  state.selectedCity = action.payload.city;
};

// Функция для обновления состояния после успешной отправки комментария
const handlePostCommentFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TReviewOffer>
) => {
  state.commentPostedError = false;
  state.commentPosted = false;
  toast('Коммент успешно отправлен');
  state.currentOfferComments = [...state.currentOfferComments, action.payload];
};

// Функция для обновления состояния после успешного изменения статуса избранного предложения
const handleFetchFavoriteStatusFulfilled = (
  state: OfferProcess,
  action: PayloadAction<TOffer>,
  status: number
) => {
  const offer = state.offers.find((of) => of.id === action.payload.id);
  if (offer) {
    offer.isFavorite = !offer.isFavorite;
  }
  switch (status) {
    case 1:
      state.favoriteOffers.push(action.payload);
      break;
    case 0:
      state.favoriteOffers = state.favoriteOffers.filter(
        (item) => item.id !== action.payload.id
      );
      break;
  }
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
        offer.isFavorite = !offer.isFavorite;
      }
    },
    dispatchRedirect: () => void {},
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffers.fulfilled, (state, action) =>
        handleFetchOffersFulfilled(state, action)
      )
      .addCase(fetchOffers.rejected, (state) => {
        state.offers = [];
        state.loaded = true;
      })
      .addCase(fetchFavoriteOffers.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
      })
      .addCase(fetchFavoriteOffers.rejected, (state) => {
        state.favoriteOffers = [];
      })
      .addCase(fetchOffer.fulfilled, (state, action) =>
        handleFetchOfferFulfilled(state, action)
      )
      .addCase(fetchOffer.rejected, (state) => {
        state.loaded = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.currentOfferComments = action.payload;
      })
      .addCase(fetchNearByOffers.fulfilled, (state, action) => {
        const offers = action.payload.map((offer) => {
          const location = { ...offer.location, id: offer.id };
          offer.location = location;
          return offer;
        });
        state.nearByOffers = offers;
      })
      .addCase(postComment.pending, (state) => {
        state.commentPosted = true;
        state.commentPostedError = false;
      })
      .addCase(postComment.fulfilled, (state, action) =>
        handlePostCommentFulfilled(state, action)
      )
      .addCase(postComment.rejected, (state, action) => {
        state.commentPosted = false;
        state.commentPostedError = true;
        toast(`Ошибка отправки формы ${action.error.message}`);
      })
      .addCase(fetchFavoriteStatus.fulfilled, (state, action) => {
        const status = action.meta.arg.status;
        handleFetchFavoriteStatusFulfilled(state, action, status);
      });

  },
});

export const { dispatchSelectedCity, dispatchNearByOfferToFavorite, dispatchRedirect } =
  offerProcess.actions;
