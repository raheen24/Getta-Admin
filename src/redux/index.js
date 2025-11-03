import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from 'redux'
import userReducer from '../redux/slice/userslice'
import sidebarReducer from '../redux/slice/sidebarSlice'
const rootReducer = combineReducers({
  user: userReducer,
  sidebar: sidebarReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], 
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
})

export const persistor = persistStore(store)
