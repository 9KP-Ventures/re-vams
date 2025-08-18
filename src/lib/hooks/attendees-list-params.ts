import { useTransition } from "react";
import {
  GET_SLOT_ATTENDEES_SORT_OPTIONS,
  GET_SLOT_ATTENDEES_SORT_ORDERS,
  GetSlotAttendeesOrderType,
  GetSlotAttendeesSortType,
} from "../requests/events/attendance-slots/attendees/get-many";
import { useQueryState, useQueryStates } from "nuqs";

type DefaultParamsType = {
  page: number | null;
  search: string;
  sort: GetSlotAttendeesSortType;
  order: GetSlotAttendeesOrderType;
};

const DEFAULT_PARAMS: DefaultParamsType = {
  page: null,
  search: "",
  sort: "recorded_time",
  order: "asc",
};

export function useAttendeesListParams() {
  const [isPending, startTransition] = useTransition();

  const [search, setSearchParam] = useQueryState("search", {
    defaultValue: DEFAULT_PARAMS.search,
    shallow: false,
    startTransition,
  });

  const [{ page, sort, order }, setParams] = useQueryStates(
    {
      page: {
        defaultValue: DEFAULT_PARAMS.page,
        parse: value => {
          const parsed = parseInt(value);
          return !isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_PARAMS.page;
        },
      },
      sort: {
        defaultValue: DEFAULT_PARAMS.sort,
        parse: (value): GetSlotAttendeesSortType | null =>
          GET_SLOT_ATTENDEES_SORT_OPTIONS.includes(
            value as GetSlotAttendeesSortType
          )
            ? (value as GetSlotAttendeesSortType)
            : DEFAULT_PARAMS.sort,
      },
      order: {
        defaultValue: DEFAULT_PARAMS.order,
        parse: (value): GetSlotAttendeesOrderType | null =>
          GET_SLOT_ATTENDEES_SORT_ORDERS.includes(
            value as GetSlotAttendeesOrderType
          )
            ? (value as GetSlotAttendeesOrderType)
            : DEFAULT_PARAMS.order,
      },
    },
    { shallow: false, startTransition }
  );

  const setSort = (newSort: GetSlotAttendeesSortType) => {
    setParams({ sort: newSort });
  };

  const setOrder = (newOrder: GetSlotAttendeesOrderType) => {
    setParams({ order: newOrder });
  };

  const setPage = (newPage: number) => {
    setParams({ page: newPage });
  };

  const setSortWithOrder = (
    newSort: GetSlotAttendeesSortType,
    newOrder: GetSlotAttendeesOrderType
  ) => {
    setParams({ sort: newSort, order: newOrder });
  };

  const setSearch = (newSearch: string | null) => {
    startTransition(() => {
      setParams({
        order: "asc",
        sort: "last_name",
      });
      setSearchParam(newSearch);
    });
  };

  const resetAllParams = () => {
    startTransition(() => {
      setParams({
        sort: DEFAULT_PARAMS.sort,
        order: DEFAULT_PARAMS.order,
        page: DEFAULT_PARAMS.page,
      });
      setSearchParam(null);
    });
  };

  return {
    isPending,
    search,
    setSearch,
    page,
    setPage,
    sort,
    setSort,
    order,
    setOrder,
    setSortWithOrder,
    resetAllParams,
  };
}
