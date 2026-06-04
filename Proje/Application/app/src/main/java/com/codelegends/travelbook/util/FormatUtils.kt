package com.codelegends.travelbook.util

object FormatUtils {

    private val TURKISH_MONTHS = listOf(
        "", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    )

    fun formatDate(value: String, fallback: String = "Belirtilmedi"): String {
        val trimmed = value.take(10)
        if (trimmed.length < 10) return fallback
        return try {
            val parts = trimmed.split("-")
            val year = parts[0].toInt()
            val month = parts[1].toInt()
            val day = parts[2].toInt()
            "$day ${TURKISH_MONTHS.getOrElse(month) { trimmed }} $year"
        } catch (e: Exception) {
            trimmed
        }
    }

    fun formatDateRange(
        start: String,
        end: String,
        fallback: String = "Tarih belirtilmedi"
    ): String {
        if (start.isBlank() && end.isBlank()) return fallback
        if (end.isBlank()) return formatDate(start, fallback)
        val formattedStart = formatDate(start, fallback)
        val formattedEnd = formatDate(end, fallback)
        return if (formattedStart == formattedEnd) formattedStart
        else "$formattedStart - $formattedEnd"
    }

    fun formatPrice(price: Double): String =
        if (price <= 0.0) "Fiyat yakında" else "₺${price.toInt()}"
}
