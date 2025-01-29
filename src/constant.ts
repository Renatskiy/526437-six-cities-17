export enum AppRouter {
    Root = '/',
    Favorites='favorites',
    Login = '/login',
    Offer = 'offer/:id',
    NotFound = '/404',
}


export enum NameSpace {
  User = 'USER',
  Offer = 'OFFER',
  Login = 'LOGIN'
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}


export enum PrivateStatus {
    Auth = 'AUTH',
    Guest = 'GUEST',
    Unknown = 'UNKNOWN'
}

export const URL_MARKER_DEFAULT = '../img/pin.svg';

export const URL_MARKER_CURRENT = '../img/pin-active.svg';
export const SORTITEMS: {title: string; type: string}[] = [
  {title: 'Popular', type: 'default'},
  {title: 'Price: low to high', type: 'low'},
  {title: 'Price: high to low', type: 'hight'},
  {title: 'Top rated first', type: 'top'},
];

export const OFFER_COUNT = 3;

export const RATINGS = [
  {value: 5, title: 'perfect'},
  {value: 4, title: 'good'},
  {value: 3, title: 'not bad'},
  {value: 2, title: 'badly'},
  {value: 1, title: 'terribly'},
];

export const Comment = {
  MinLength: 50,
  MaxLength: 300,
  MinCount: 0,
  MaxCount: 10,
  InitState: '',
};

export const Rating = {
  InitState: 0,
  Multiplier: 20,
};

export const UPLOAD_URL = 'https://16.design.htmlacademy.pro';
export const TIME_OUT = 5000;
