// The prototype's timeline constants. Story times are in ms; `*_T` values are fractions of beat 2's story.

// Beat 1: the home assembling.
export const T1 = 1100
// Beat 2: the story inside Ginger's room.
export const T2 = 3400
// Beat 2's gates: Telli waits at G1 for "Invite Telli", the rows wait at G2 for "Add all suggested info".
const G1 = 1100
const G2 = 2900
// Beat 3: Paula joining.
export const T3 = 2400

export const G1_T = G1 / T2
export const G2_T = G2 / T2
export const INVITE_FROM_T = 1000 / T2
export const ADDALL_FROM_T = 2800 / T2
// How much of the move from beat 2 to 3 plays the rest of beat 2's story when the reviewer skips the demo.
export const STORY_SPAN = 0.6

export const CAM_MS = 800
export const CAM_BEZIER = [0.45, 0, 0.2, 1] as const
export const CAM_MIN_MS = 250
export const CAM_MAX_MS = 1400
export const CAM_MS_PER_BEAT = 700
export const STORY_LEG_MS_FULL = 1400
export const STORY_LEG_MIN = 250
export const STORY_LEG_MAX = 1100
export const BACK_STORY_LEG_MS = 800
// Beat 2 times when a button press is shown; story legs never rush through them.
export const PRESS_WINDOWS_M2 = [1100, 1250, 2900, 3050] as const
export const PRESS_MIN_MS = 200
export const ADDALL_PLAY_MS = 500
export const SETTLE_DELAY_MS = 100
export const SKIP_OUT_MS = 180
export const SKIP_IN_MS = 240
export const RM_OUT_MS = 100
export const RM_IN_MS = 150
export const PAN_ACTIVE_X = 12
export const PAN_FAIL_Y = 16
// One beat per this fraction of the column width.
export const PAN_BEAT_WIDTH = 0.8
export const RUBBER_RESIST = 0.25
export const RUBBER_MAX = 0.15
export const FLING_PROJECT_S = 0.25
export const SNAP_SPRING = { damping: 34.6, mass: 1, stiffness: 300 } as const
export const SNAP_REST_EPS = 0.004
export const PULSE_DELAY_MS = 400
export const PULSE_HALF_MS = 150

export const NOTE_DONE_T = 900 / T2
export const RM_TEXT_MS = 200
export const RM_PAGER_MS = 150
export const RM_INVITE_OUT_MS = 100
export const RM_INVITE_IN_MS = 150
export const RM_ADDALL_OUT_MS = 80
export const RM_ADDALL_IN_MS = 120
export const RM_CONFIRM_OUT_MS = 125
export const RM_CONFIRM_IN_MS = 125
export const RM_CONFIRM_HOLD_MS = 500
export const RM_INVITE_BTN_MS = 200
export const RM_PAN_FRACTION = 0.2
export const PAN_MOVED_BEATS = 0.02
export const LATCH_S1_Q = 0.25
export const LATCH_T3_Q = 2.35
