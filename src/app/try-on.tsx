import { TryOnFlow } from '@/features/try-on/try-on-flow';

/**
 * Hosts the full hairstyle try-on flow: camera → analyzing → hair profile →
 * catalog → generating → result → barber brief → show mode. The flow owns
 * its own state machine (`TryOnFlowProvider`), scoped to this route — see
 * `src/features/try-on/flow-context.tsx`.
 */
export default function TryOnRoute() {
  return <TryOnFlow />;
}
