import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelIcon from "@mui/icons-material/Cancel";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getImageUrl } from "../services/api";
import { formatDate, getRouteLabel } from "../utils/tour-formatters";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600";

export default function TourCard({
  tour,
  variant = "full",
  onDetail,
  onPurchase,
  onCancel,
  onToggleFavorite,
  purchaseLoading,
  cancelLoading,
  favoriteLoading,
  isPurchased,
  isFavorite,
}) {
  const compact = variant === "compact";
  const routeLabel = getRouteLabel(tour);

  const cardContent = (
    <>
      <CardMedia
        component="img"
        height={compact ? 180 : 200}
        image={getImageUrl(tour.imageUrl) || FALLBACK_IMAGE}
        alt={tour.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, p: compact ? 2 : 2.5 }}>
        <Typography
          variant={compact ? "subtitle1" : "h6"}
          fontWeight={700}
          noWrap
          sx={{ mb: 0.5 }}
        >
          {tour.name}
        </Typography>

        {/* Route */}
        {routeLabel && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 1,
            }}
          >
            <ArrowRightAltIcon
              sx={{ fontSize: compact ? 18 : 20, color: "secondary.main" }}
            />
            <Typography variant="body2" color="text.secondary" noWrap>
              {routeLabel}
            </Typography>
          </Box>
        )}

        {/* Dates */}
        {!compact && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 1.5,
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 16, color: "text.disabled" }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
            </Typography>
          </Box>
        )}

        {/* Rating */}
        {!compact && tour.rating > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 1.5,
            }}
          >
            <Rating value={tour.rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              ({tour.rating})
            </Typography>
          </Box>
        )}

        {/* Services */}
        {!compact && tour.services?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mb: 1.5,
            }}
          >
            {tour.services.map((service) => (
              <Chip
                key={service}
                label={service}
                size="small"
                variant="outlined"
                color="secondary"
              />
            ))}
          </Box>
        )}

        {/* Company & Guide */}
        {!compact && (tour.companyName || tour.guideName) && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
            {tour.companyName && (
              <Chip
                icon={<BusinessIcon />}
                label={tour.companyName}
                size="small"
                variant="outlined"
              />
            )}
            {tour.guideName && (
              <Chip
                icon={<PersonIcon />}
                label={tour.guideName}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
          </Box>
        )}

        {/* Price row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
          }}
        >
          <Typography
            variant={compact ? "subtitle1" : "h5"}
            fontWeight={800}
            color="secondary.main"
          >
            ₺{tour.price?.toLocaleString("tr-TR")}
          </Typography>
        </Box>
      </CardContent>
    </>
  );

  const hasActions =
    !compact && (onToggleFavorite || onPurchase || (isPurchased && onCancel));

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      {onDetail ? (
        <CardActionArea
          onClick={() => onDetail(tour)}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {cardContent}
        </CardActionArea>
      ) : (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {cardContent}
        </Box>
      )}

      {hasActions && (
        <CardActions
          sx={{ px: 2.5, pb: 2, pt: 0, flexDirection: "column", gap: 0.5 }}
        >
          {onToggleFavorite && (
            <Button
              variant={isFavorite ? "contained" : "outlined"}
              color="error"
              fullWidth
              size="small"
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => onToggleFavorite(tour)}
              disabled={favoriteLoading === tour.id}
              sx={{ borderRadius: 2 }}
            >
              {favoriteLoading === tour.id
                ? "İşleniyor..."
                : isFavorite
                  ? "Favorilerde"
                  : "Favorilere Ekle"}
            </Button>
          )}

          {onPurchase && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="small"
              startIcon={<ShoppingCartIcon />}
              onClick={() => onPurchase(tour)}
              disabled={purchaseLoading === tour.id || !!isPurchased}
              sx={{ borderRadius: 2 }}
            >
              {purchaseLoading === tour.id
                ? "İşleniyor..."
                : isPurchased
                  ? "Satın Alındı"
                  : "Satın Al"}
            </Button>
          )}

          {isPurchased && onCancel && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              size="small"
              startIcon={<CancelIcon />}
              onClick={() => onCancel(tour)}
              disabled={cancelLoading === tour.id}
              sx={{ borderRadius: 2 }}
            >
              {cancelLoading === tour.id ? "İptal ediliyor..." : "İptal Et"}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
