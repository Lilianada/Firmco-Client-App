import { SET_USER_NAME, SET_USER_ID, SET_TOTAL_BALANCE } from '../actions/userActions';

const initialState = {
  name: '',
  userId: '',
  balance: ''
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAME:
      return {
        ...state,
        name: action.payload
      };
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload
      };
    case SET_TOTAL_BALANCE:
      return {
        ...state,
        balance: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
