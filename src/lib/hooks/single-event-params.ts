import { useQueryState } from "nuqs";
import { useTransition } from "react";

type DefaultParamsType = {
  student_id: string | null;
  time_slot: number | null;
};

// Centralize default values for easier management
const DEFAULT_PARAMS: DefaultParamsType = {
  student_id: null,
  time_slot: null,
};

export function useSingleEventParams() {
  const [isPending, startTransition] = useTransition();

  const [student_id, setStudentId] = useQueryState("student_id", {
    defaultValue: DEFAULT_PARAMS.student_id,
    shallow: true,
    history: "replace",
    startTransition,
    parse: value => value || DEFAULT_PARAMS.student_id,
  });

  const [time_slot, setTimeSlot] = useQueryState("time_slot", {
    defaultValue: DEFAULT_PARAMS.time_slot,
    shallow: false,
    history: "push",
    startTransition,
    parse: value => {
      const parsed = parseInt(value);
      return !isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_PARAMS.time_slot;
    },
  });

  return {
    studentId: student_id,
    setStudentId,
    timeSlot: time_slot,
    setTimeSlot,
    isPending,
  };
}
