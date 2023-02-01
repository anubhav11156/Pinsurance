import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  haveAccount:''
};

export const accountDetailSlice = createSlice({
  name: 'accountDetail',
  initialState,
  reducers: {
    accountAdded: {
      reducer(state, action) {
        state.haveAccount = action.payload.userHaveAccount;
      },
      prepare(userHaveAccount) {
        return {
          payload: {
            userHaveAccount
          }
        }
      }
    }
  }
})

export const selectAccount = (state) => state.accountDetail;
export const { accountAdded } = accountDetailSlice.actions;
export default accountDetailSlice.reducer;
