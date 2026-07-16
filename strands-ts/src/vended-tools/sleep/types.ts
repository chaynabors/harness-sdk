/**
 * Type definitions and constants for the sleep tool.
 */

/**
 * Default upper bound on `duration` (seconds) accepted by {@link makeSleep}.
 */
export const DEFAULT_MAX_DURATION = 60

/**
 * Description shown to the model for the sleep tool.
 */
export const SLEEP_DESCRIPTION =
  'Pauses execution for a specified number of seconds. Cooperative and cancellable: ' +
  'the sleep aborts immediately when the agent invocation is cancelled. ' +
  'Rejects negative, NaN, infinite, or non-numeric durations, and durations ' +
  "above the tool's configured maximum."

/**
 * Input parameters accepted by the sleep tool.
 */
export interface SleepInput {
  /**
   * Seconds to pause. Must be a finite, non-negative number and no larger than
   * the tool's configured maximum.
   */
  duration: number
}
