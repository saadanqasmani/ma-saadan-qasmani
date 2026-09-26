import { CAMPUS, SCHOOL, SIGNED_IN_ADVISOR, SUPERVISOR } from "@/content/edviko/demo";

/**
 * Who the portal says is looking, until a session says it instead.
 *
 * One place, so that the day there is authentication there is one function
 * to change rather than nine pages.
 */
export const ADVISOR_WHO = {
  name: SIGNED_IN_ADVISOR.name,
  line: `${SCHOOL.name} · ${CAMPUS.name}`,
  code: SIGNED_IN_ADVISOR.code,
};

export const CAMPUS_WHO = {
  name: SUPERVISOR.name,
  line: `${SCHOOL.name} · ${CAMPUS.name}`,
  code: CAMPUS.code,
};
