import { useQueryStates } from "nuqs";
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

  // Group related parameters with strict typing
  const [{ student_id, time_slot }, setParams] = useQueryStates(
    {
      student_id: {
        defaultValue: DEFAULT_PARAMS.student_id,
        parse: value => value || DEFAULT_PARAMS.student_id,
      },
      time_slot: {
        defaultValue: DEFAULT_PARAMS.time_slot,
        parse: value => {
          const parsed = parseInt(value);
          return !isNaN(parsed) && parsed > 0
            ? parsed
            : DEFAULT_PARAMS.time_slot;
        },
      },
    },
    {
      history: "push",
      shallow: false,
      startTransition,
    }
  );

  // Helper methods with strict typing
  const setStudentId = (newStudentId: string | null) => {
    setParams({
      student_id: newStudentId || DEFAULT_PARAMS.student_id,
    });
  };

  const setTimeSlot = (newTimeSlot: number | null) => {
    setParams({
      time_slot: newTimeSlot || DEFAULT_PARAMS.time_slot,
      student_id: null,
    });
  };

  return {
    studentId: student_id,
    setStudentId,
    timeSlot: time_slot,
    setTimeSlot,
    isPending,
  };
}
