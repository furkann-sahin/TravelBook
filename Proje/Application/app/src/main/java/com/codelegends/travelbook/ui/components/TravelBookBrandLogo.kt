package com.codelegends.travelbook.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.codelegends.travelbook.R

@Composable
fun TravelBookBrandLogo(
    modifier: Modifier = Modifier,
    iconSize: Dp = 32.dp,
    textStyle: TextStyle = MaterialTheme.typography.titleLarge,
    textColor: Color = MaterialTheme.colorScheme.primary,
    spacing: Dp = 8.dp
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = painterResource(id = R.drawable.ic_launcher_foreground_image),
            contentDescription = "TravelBook logosu",
            modifier = Modifier
                .size(iconSize)
                .clip(RoundedCornerShape(8.dp))
        )

        Spacer(modifier = Modifier.width(spacing))

        Text(
            text = "TravelBook",
            style = textStyle,
            fontWeight = FontWeight.ExtraBold,
            color = textColor
        )
    }
}
