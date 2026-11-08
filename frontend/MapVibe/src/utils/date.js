export const formatDate = (dateString) => {
  if (!dateString) return "";

  const normalized = dateString.replace(/\.(\d{3})\d+$/, ".$1");

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};