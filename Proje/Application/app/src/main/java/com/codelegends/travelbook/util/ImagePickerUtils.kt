package com.codelegends.travelbook.util

import android.content.ContentResolver
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.OpenableColumns
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream

data class ImagePickerPayload(
    val fileName: String,
    val mimeType: String,
    val bytes: ByteArray
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        other as ImagePickerPayload
        if (fileName != other.fileName) return false
        if (mimeType != other.mimeType) return false
        if (!bytes.contentEquals(other.bytes)) return false
        return true
    }

    override fun hashCode(): Int {
        var result = fileName.hashCode()
        result = 31 * result + mimeType.hashCode()
        result = 31 * result + bytes.contentHashCode()
        return result
    }
}

private val ALLOWED_MIME_TYPES = setOf("image/jpeg", "image/png", "image/webp", "image/gif")
private const val MAX_RAW_BYTES = 20 * 1024 * 1024  // 20 MB input cap
private const val MAX_DIMENSION = 1280
private const val JPEG_QUALITY = 82

suspend fun ContentResolver.readImagePickerPayload(
    uri: Uri,
    fileNamePrefix: String = "image"
): ImagePickerPayload? = withContext(Dispatchers.IO) {
    val mimeType = getType(uri) ?: "image/jpeg"
    if (mimeType !in ALLOWED_MIME_TYPES) return@withContext null

    val rawBytes = openInputStream(uri)?.use { it.readBytes() } ?: return@withContext null
    if (rawBytes.isEmpty() || rawBytes.size > MAX_RAW_BYTES) return@withContext null

    val compressed = compressImage(rawBytes) ?: return@withContext null

    val rawFileName = query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)
        ?.use { cursor ->
            if (cursor.moveToFirst()) {
                val idx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (idx >= 0) cursor.getString(idx) else null
            } else null
        } ?: "$fileNamePrefix-${System.currentTimeMillis()}.jpg"

    // Always JPEG after compression — normalize extension
    val fileName = rawFileName.replaceAfterLast('.', "jpg").let {
        if ('.' !in it) "$it.jpg" else it
    }

    ImagePickerPayload(fileName = fileName, mimeType = "image/jpeg", bytes = compressed)
}

private fun compressImage(rawBytes: ByteArray): ByteArray? {
    // First pass: read dimensions only (no allocation)
    val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    BitmapFactory.decodeByteArray(rawBytes, 0, rawBytes.size, bounds)
    val srcWidth = bounds.outWidth
    val srcHeight = bounds.outHeight
    if (srcWidth <= 0 || srcHeight <= 0) return null

    // Second pass: subsample to avoid loading full resolution into memory
    val decodeOptions = BitmapFactory.Options().apply {
        inSampleSize = calculateSampleSize(srcWidth, srcHeight)
        inPreferredConfig = Bitmap.Config.RGB_565
    }
    val decoded = BitmapFactory.decodeByteArray(rawBytes, 0, rawBytes.size, decodeOptions)
        ?: return null

    // Fine-scale if still larger than MAX_DIMENSION after subsampling
    val bitmap = if (decoded.width > MAX_DIMENSION || decoded.height > MAX_DIMENSION) {
        val scale = MAX_DIMENSION.toFloat() / maxOf(decoded.width, decoded.height)
        val scaled = Bitmap.createScaledBitmap(
            decoded,
            (decoded.width * scale).toInt(),
            (decoded.height * scale).toInt(),
            true
        )
        if (scaled !== decoded) decoded.recycle()
        scaled
    } else {
        decoded
    }

    val out = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.JPEG, JPEG_QUALITY, out)
    bitmap.recycle()
    return out.toByteArray()
}

private fun calculateSampleSize(width: Int, height: Int): Int {
    var sampleSize = 1
    val longest = maxOf(width, height)
    while (longest / (sampleSize * 2) >= MAX_DIMENSION) {
        sampleSize *= 2
    }
    return sampleSize
}
