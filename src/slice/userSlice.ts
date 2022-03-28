import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IUserState {
    userName:string|null|undefined,
    userEmail:string|null|undefined,
    isLoading:string,
}

// const user:string|null = localStorage.getItem("user")

// const USER_INFO = user?JSON.parse(user):null

const initialState:IUserState = {
    // userName:USER_INFO?.displayName,
    // userEmail:USER_INFO?.email,
    userEmail:null,
    userName:null,
    isLoading:'pending'
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
      setActiveUser:(state,action:PayloadAction<IUserState>)=>{
          state.userName = action.payload.userName;
          state.userEmail = action.payload.userEmail;
          state.isLoading = action.payload.isLoading;
      },
      setUserLogOutState:(state)=>{
          state.userName = null
          state.userEmail = null
      },
      setLoadingState:(state,action:PayloadAction<string>)=>{
        state.isLoading = action.payload;
      }
  }
});

export const {setActiveUser,setUserLogOutState,setLoadingState} = userSlice.actions

export default userSlice.reducer