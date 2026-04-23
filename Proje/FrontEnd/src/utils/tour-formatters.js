export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getRouteLabel(tour) {
  if (tour.departureLocation && tour.arrivalLocation) {
    return `${tour.departureLocation} → ${tour.arrivalLocation}`;
  }
  return tour.location || "";
}