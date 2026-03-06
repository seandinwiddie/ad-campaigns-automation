'use client';

import { useAppSelector } from '@/app/hooks';
import { selectCurrentPage } from '@/features/core/ui/slice/uiSelectors';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { PipelineScreen } from '@/components/screens/PipelineScreen';
import { ResultsScreen } from '@/components/screens/ResultsScreen';

const SCREENS = {
  settings: SettingsScreen,
  home: HomeScreen,
  pipeline: PipelineScreen,
  results: ResultsScreen,
} as const;

export function ScreenRouter() {
  const currentPage = useAppSelector(selectCurrentPage);
  const Screen = SCREENS[currentPage] ?? SettingsScreen;
  return <Screen />;
}
