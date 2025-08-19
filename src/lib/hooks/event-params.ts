import { Constants } from "@/app/utils/supabase/types";
import { useQueryState, useQueryStates } from "nuqs";
import { useTransition } from "react";
import {
  GET_EVENTS_SORT_OPTIONS,
  GET_EVENTS_SORT_ORDERS,
  GetEventsOrderType,
  GetEventsSortType,
  GetEventsStatusType,
} from "../requests/events/get-many";

type DefaultParamsType = {
  search: string;
  status: GetEventsStatusType | null;
  semester_id: number | null;
  sort: GetEventsSortType;
  order: GetEventsOrderType;
  page: number | null;
};

// Centralize default values for easier management
const DEFAULT_PARAMS: DefaultParamsType = {
  search: "",
  status: null,
  semester_id: null,
  sort: "date",
  order: "desc",
  page: null,
};

export function useEventsParams() {
  const [isPending, startTransition] = useTransition();

  // Set up search separately since it needs special handling
  const [search, setSearchParam] = useQueryState("search", {
    defaultValue: DEFAULT_PARAMS.search,
    shallow: false,
    startTransition,
  });

  // Group related parameters with strict typing
  const [{ status, semester_id, sort, order, page }, setParams] =
    useQueryStates(
      {
        status: {
          defaultValue: DEFAULT_PARAMS.status,
          parse: (value): GetEventsStatusType | null =>
            Constants.public.Enums.Status.includes(value as GetEventsStatusType)
              ? (value as GetEventsStatusType)
              : DEFAULT_PARAMS.status,
        },
        semester_id: {
          defaultValue: DEFAULT_PARAMS.semester_id,
          parse: value => {
            const parsed = parseInt(value);
            return !isNaN(parsed) && parsed > 0
              ? parsed
              : DEFAULT_PARAMS.semester_id;
          },
        },
        sort: {
          defaultValue: DEFAULT_PARAMS.sort,
          parse: (value): GetEventsSortType | null =>
            GET_EVENTS_SORT_OPTIONS.includes(value as GetEventsSortType)
              ? (value as GetEventsSortType)
              : DEFAULT_PARAMS.sort,
        },
        order: {
          defaultValue: DEFAULT_PARAMS.order,
          parse: (value): GetEventsOrderType | null =>
            GET_EVENTS_SORT_ORDERS.includes(value as GetEventsOrderType)
              ? (value as GetEventsOrderType)
              : DEFAULT_PARAMS.order,
        },
        page: {
          defaultValue: DEFAULT_PARAMS.page,
          parse: value => {
            const parsed = parseInt(value);
            return !isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_PARAMS.page;
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
  const setStatus = (newStatus: GetEventsStatusType | null) => {
    setParams({ status: newStatus || DEFAULT_PARAMS.status, page: null });
  };

  const setSemesterId = (newSemesterId: number | null) => {
    setParams({
      semester_id: newSemesterId || DEFAULT_PARAMS.semester_id,
      page: null,
    });
  };

  const setSort = (newSort: GetEventsSortType) => {
    setParams({ sort: newSort });
  };

  const setOrder = (newOrder: GetEventsOrderType) => {
    setParams({ order: newOrder });
  };

  const setPage = (newPage: number) => {
    setParams({ page: newPage });
  };

  const setSortWithOrder = (
    newSort: GetEventsSortType,
    newOrder: GetEventsOrderType
  ) => {
    setParams({
      sort: newSort,
      order: newOrder,
    });
  };

  const setSearch = (newSearch: string | null) => {
    startTransition(() => {
      setParams({
        order: "asc",
        sort: "name",
        page: DEFAULT_PARAMS.page,
      });
      setSearchParam(newSearch);
    });
  };

  const resetAllParams = () => {
    startTransition(() => {
      setParams({
        status: DEFAULT_PARAMS.status,
        semester_id: DEFAULT_PARAMS.semester_id,
        sort: DEFAULT_PARAMS.sort,
        order: DEFAULT_PARAMS.order,
        page: DEFAULT_PARAMS.page,
      });
      setSearchParam(null);
    });
  };

  return {
    search,
    setSearch,
    status: status as GetEventsStatusType | null,
    setStatus,
    semesterId: semester_id,
    setSemesterId,
    sort: sort as GetEventsSortType | null,
    setSort,
    order: order as GetEventsOrderType | null,
    setOrder,
    page,
    setPage,
    setSortWithOrder,
    resetAllParams,
    isPending,
  };
}
