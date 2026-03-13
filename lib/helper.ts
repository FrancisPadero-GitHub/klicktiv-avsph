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
