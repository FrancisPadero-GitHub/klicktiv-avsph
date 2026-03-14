export const shortId = (value: string | null) => {
  if (!value) return "";
  return value.slice(0, 8);
};

export const formatEntityType = (entityType: string | null | undefined) => {
  if (!entityType) return "";

  const mapping: Record<string, string> = {
    work_order: "Work Order",
    estimate: "Estimate",
    jobs: "Jobs",
    review_records: "Review Records",
  };

  return (
    mapping[entityType] ||
    entityType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

export const fmt = (n: number) => {
  if (n === 0) return "0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
};

export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateWithTime = (dateStr: string | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/** Derive p_start_date / p_end_date from the current filter mode
 *
 * Used in the over dashboard filter
 */

export function resolveDateRange(
  mode: string,
  year: number,
  month: number,
  isoWeek: string,
  date: string,
  startDate: string,
  endDate: string,
): { p_start_date: string | undefined; p_end_date: string | undefined } {
  const toISO = (d: Date) => d.toISOString().slice(0, 10);
  switch (mode) {
    case "all":
      return { p_start_date: undefined, p_end_date: undefined };

    case "year":
      return {
        p_start_date: `${year}-01-01`,
        p_end_date: `${year}-12-31`,
      };

    case "month": {
      const mm = String(month).padStart(2, "0");
      const lastDay = new Date(year, month, 0).getDate();
      return {
        p_start_date: `${year}-${mm}-01`,
        p_end_date: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
      };
    }

    case "week": {
      const match = isoWeek.match(/^(\d{4})-W(\d{2})$/);
      if (!match) return { p_start_date: undefined, p_end_date: undefined };
      const y = Number(match[1]);
      const w = Number(match[2]);
      const jan4 = new Date(Date.UTC(y, 0, 4));
      const jan4Day = jan4.getUTCDay() || 7;
      const mondayWeek1 = new Date(jan4);
      mondayWeek1.setUTCDate(jan4.getUTCDate() - jan4Day + 1);
      const weekStart = new Date(mondayWeek1);
      weekStart.setUTCDate(mondayWeek1.getUTCDate() + (w - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
      return { p_start_date: toISO(weekStart), p_end_date: toISO(weekEnd) };
    }

    case "day":
      return { p_start_date: date, p_end_date: date };

    case "range":
      return {
        p_start_date: startDate || undefined,
        p_end_date: endDate || undefined,
      };

    default:
      return { p_start_date: undefined, p_end_date: undefined };
  }
}
