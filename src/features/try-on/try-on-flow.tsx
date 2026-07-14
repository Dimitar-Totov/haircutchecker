import { TryOnFlowProvider, useTryOnFlow } from '@/features/try-on/flow-context';
import { AnalyzingScreen } from '@/features/try-on/screens/analyzing-screen';
import { BarberBriefScreen } from '@/features/try-on/screens/barber-brief-screen';
import { CameraScreen } from '@/features/try-on/screens/camera-screen';
import { CatalogScreen } from '@/features/try-on/screens/catalog-screen';
import { GeneratingScreen } from '@/features/try-on/screens/generating-screen';
import { HairProfileScreen } from '@/features/try-on/screens/hair-profile-screen';
import { ResultScreen } from '@/features/try-on/screens/result-screen';
import { ShowModeScreen } from '@/features/try-on/screens/show-mode-screen';

/**
 * Screen switch, ported from `Screen.dc.html`'s `isCamera`/`isAnalyzing`/…
 * flags — one flow-level provider owns state, this component renders the
 * screen for the current `state.screen`.
 */
function TryOnFlowSwitch() {
  const { state } = useTryOnFlow();

  switch (state.screen) {
    case 'camera':
      return <CameraScreen />;
    case 'analyzing':
      return <AnalyzingScreen />;
    case 'profile':
      return <HairProfileScreen />;
    case 'catalog':
      return <CatalogScreen />;
    case 'generating':
      return <GeneratingScreen />;
    case 'result':
      return <ResultScreen />;
    case 'brief':
      return <BarberBriefScreen />;
    case 'show':
      return <ShowModeScreen />;
  }
}

export function TryOnFlow() {
  return (
    <TryOnFlowProvider>
      <TryOnFlowSwitch />
    </TryOnFlowProvider>
  );
}
