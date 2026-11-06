/**
 * Every programme the desk runs, in the order they appear in the header.
 *
 * The types live with AJSRC, which was the first of them and is still the
 * one the shape was drawn from. This file exists so that adding a third
 * conference is one import and one entry in the list, and so that nothing
 * outside this folder has to know which file a programme is written in.
 */

export type {
  Funnel,
  FunnelKey,
  FunnelMonth,
  Program,
  ProgramItem,
  ProgramItemKind,
  ProgramMilestone,
  ProgramMonth,
} from "./ajsrc";

import type { Program } from "./ajsrc";
import { AJSRC } from "./ajsrc";
import { IECES_2027 } from "./ieces2027";

export { AJSRC, IECES_2027 };

export const PROGRAMS: Program[] = [AJSRC, IECES_2027];
