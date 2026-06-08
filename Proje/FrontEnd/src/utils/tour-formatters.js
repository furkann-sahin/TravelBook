export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getRouteLabel(tour) {
  if (tour.departureLocation && tour.arrivalLocation) {
    return `${tour.departureLocation} → ${tour.arrivalLocation}`;
  }
  return tour.location || "";
}