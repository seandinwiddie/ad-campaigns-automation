/**
 * Custom Redux hooks for use throughout the application.
 * provides strongly-typed versions of the standard useDispatch and useSelector hooks.
 */
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';

/**
 * Hook to access the Redux dispatch function with AppDispatch types.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Hook to access the Redux state with RootState types.
 */
export const useAppSelector = useSelector.withTypes<RootState>();
