import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address:'',
  balance:''
};

export const accountDetailSlice = createSlice({
  name: 'accountDetail',
  initialState,
  reducers: {
    accountAdded: {
      reducer(state, action) {
        state.address = action.payload.userAdrress;
        state.balance = action.payload.userBalance;
      },
      prepare(userAdrress, userBalance) {
        return {
          payload: {
            userAdrress,
            userBalance
          }
        }
      }
    }
    
  }
})

export const selectAccount = (state) => state.accountDetail;
export const { accountAdded } = accountDetailSlice.actions;
export default accountDetailSlice.reducer;
