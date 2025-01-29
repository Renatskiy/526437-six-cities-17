import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, DEFAULT_CITY } from '../../constant';
import { TOffer } from '../../types/offer-types';
import { TCity } from '../../types/city-types';
import {
  fetchOffers,
  fetchFavoriteOffers,
  fetchOffer,
  fetchComments,
  fetchNearByOffers,
  postComment,
  fetchFavoriteStatus
} from '../actions/api-actions';
import { convertCitiesById } from '../../helpers/convert-cities-by-id';
import { setCities } from '../../helpers/set-cities';
import { toast } from 'react-toastify';


export interface Comment { comment: string; rating: number }

export interface OfferProcess {
  loaded: boolean;
  commentPosted: boolean;
  commentPostedError: boolean;
  offers: TOffer[];
  cityes: TCity[];
  favoriteOffers: TOffer[];
  nearByOffers: TOffer[];
  currentOffer: TOffer | string;
  currentOfferComments: Comment[];
  selectedCity: TCity;
}

// types/city-types.ts


const initialState: OfferProcess = {
  loaded: false,
  commentPosted: false,
  commentPostedError: false,
  offers: [],
  cityes: [],
  favoriteOffers: [],
  nearByOffers: [],
  currentOffer: '',
  currentOfferComments: [],
  selectedCity: DEFAULT_CITY,
};


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
  action: PayloadAction<TOffer>
) => {
  state.currentOffer = action.payload;
  state.selectedCity = action.payload.city;
};

export const handleFetchOfferRejected = (state: OfferProcess) => {
  state.loaded = true;
};

export const handleFetchCommentsFulfilled = (
  state: OfferProcess,
  action: PayloadAction<Comment[]>
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
  action: PayloadAction<Comment>
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
