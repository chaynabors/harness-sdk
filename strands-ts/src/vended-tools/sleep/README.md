# Sleep Tool

Pauses agent execution for a bounded, cooperative duration.

## What it does

The `sleep` tool pauses execution for `duration` seconds. It is:

- **Bounded**: a configurable maximum (default: 60 s) rejects oversized requests before the sleep starts.
- **Cooperative**: it attaches a one-shot listener to the invocation's `AbortSignal` (`context.agent.cancelSignal`), so cancelling the agent aborts the sleep immediately rather than waiting for the full duration.
- **Strictly validated**: negative, `NaN`, `Infinity`, and non-numeric inputs are rejected at the tool boundary.
- **Zero dependencies**: implemented on top of `setTimeout` and the standard `AbortSignal`.

## Installation

```typescript
import { sleep } from '@strands-agents/sdk/vended-tools/sleep'
```

## Usage

### With an agent

```typescript
import { Agent } from '@strands-agents/sdk'
import { sleep } from '@strands-agents/sdk/vended-tools/sleep'

const agent = new Agent({ tools: [sleep] })
await agent.invoke('Pause for two seconds, then continue.')
```

### Direct invocation

```typescript
import { sleep } from '@strands-agents/sdk/vended-tools/sleep'

const result = await sleep.invoke({ duration: 0.5 })
// "Slept for 0.5 seconds"
```

### Custom maximum

```typescript
import { makeSleep } from '@strands-agents/sdk/vended-tools/sleep'

// Cap sleeps at 5 seconds instead of the default 60.
const shortSleep = makeSleep({ maxDuration: 5 })
const agent = new Agent({ tools: [shortSleep] })
```

## API

### `sleep`

The default tool, produced by `makeSleep()` with `maxDuration = 60`.

### `makeSleep(options?)`

Creates a sleep tool with a configurable cap and (optionally) a custom name or description.

| Option        | Type     | Default    | Description                                                         |
| ------------- | -------- | ---------- | ------------------------------------------------------------------- |
| `maxDuration` | `number` | `60`       | Upper bound on `duration`, in seconds. Must be finite and positive. |
| `name`        | `string` | `sleep`    | Tool name.                                                          |
| `description` | `string` | (built-in) | Description shown to the model.                                     |

Throws if `maxDuration` is not a positive, finite number.

### Input

| Property   | Type     | Required | Description                                                           |
| ---------- | -------- | -------- | --------------------------------------------------------------------- |
| `duration` | `number` | Yes      | Seconds to pause. Must be finite, non-negative, and `<= maxDuration`. |

### Output

Returns a string of the form `"Slept for <duration> seconds"`.

### Errors

The tool throws a plain `Error` when:

- `duration` is not a number, is `NaN`, or is not finite.
- `duration` is negative.
- `duration` exceeds `maxDuration`.
- The invocation's `cancelSignal` fires before or during the sleep.

## Security posture

- **Denial of service via long sleeps** — bounded by `maxDuration` on the factory. Callers can lower it further per agent.
- **Non-cooperative sleep** — the tool listens to `context.agent.cancelSignal`; cancelling the agent aborts the timer immediately.
- **Malformed input** — every numeric edge case (`NaN`, `Infinity`, `-Infinity`, non-numeric) is rejected before the timer starts.

## Maintenance posture

Thin shim over `setTimeout` and `AbortSignal`. No third-party dependencies. The only reasonable evolution is to expose a richer unit (ms) if a future consumer needs sub-second precision beyond what floating-point seconds already provide.
