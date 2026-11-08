import { STORAGE_KEYS } from "../constants/storageKeys"

export const getAccessToken = () =>
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

export const setAccessToken = (token) =>
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

export const removeAccessToken = () =>
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);