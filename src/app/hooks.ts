/**
 * Custom Redux hooks for use throughout the application.
 * It provides strongly-typed versions of the standard useDispatch and useSelector hooks
 * so components can interact with the shared store without repeating app-specific types.
 *
 * **User Story:**
 * - As a developer building screens and controls, I want pre-typed Redux hooks so I can
 *   read state and dispatch actions safely without re-declaring store types in every file.
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
