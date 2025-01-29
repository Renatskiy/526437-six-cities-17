import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../constant';
import { UserProcess } from '../../types/state-types';
import { fetchCheckAuth, fetchLogin, fetchSignOutAction } from '../actions/api-actions';
import { toast } from 'react-toastify';
import { TUser } from '../../types/user-types';

const initialState: UserProcess = {
  authorizationStatus: false,
  userInfo: {
    name: '',
    avatarUrl: '',
    isPro: false,
    email: '',
    token: '',
  },
};
interface TPayload extends TUser { token?: string }

// Функция для сброса состояния пользователя
const resetUserState = (state: UserProcess) => {
  window.localStorage.removeItem('token');
  state.userInfo = initialState.userInfo;
  state.authorizationStatus = false;
};

// Функция для установки пользователя и статуса авторизации
const setUserAndAuthStatus = (state: UserProcess, payload: TPayload) => {
  if (payload.token) {
    window.localStorage.setItem('token', payload.token);
  }
  state.userInfo = payload;
  state.authorizationStatus = true;
};

export const userProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    dispatchDeleteLogin: (state) => {
      resetUserState(state);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCheckAuth.fulfilled, (state, action) => {
        setUserAndAuthStatus(state, action.payload);
      })
      .addCase(fetchCheckAuth.rejected, (state) => {
        resetUserState(state);
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        setUserAndAuthStatus(state, action.payload);
      })
      .addCase(fetchLogin.rejected, (state) => {
        resetUserState(state);
        toast('Пароль должен содержать минимум одну цифру и одну латинскую букву');
      })
      .addCase(fetchSignOutAction.fulfilled, (state) => {
        resetUserState(state);
      })
      .addCase(fetchSignOutAction.rejected, (state) => {
        // В данном случае, если logout не удался, мы также сбрасываем состояние пользователя
        resetUserState(state);
      });
  },
});

export const { dispatchDeleteLogin } = userProcess.actions;
