export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_TOTAL_BALANCE = 'SET_TOTAL_BALANCE';

export const setUserName = (name) => ({
  type: SET_USER_NAME,
  payload: name
});

export const setUserId = (id) => ({
  type: SET_USER_ID,
  payload: id
});

export const setTotalBalance = (balance) => ({
  type: SET_TOTAL_BALANCE,
  payload: balance
});
