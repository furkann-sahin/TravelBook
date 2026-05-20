package com.codelegends.travelbook.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp

@Immutable
data class TravelBookNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector,
    val contentDescription: String = label,
    val isHome: Boolean = false
)

@Composable
fun TravelBookBottomNavigation(
    items: List<TravelBookNavItem>,
    currentRoute: String?,
    onRouteSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    BoxWithConstraints(
        modifier = modifier.fillMaxWidth(),
        contentAlignment = Alignment.Center
    ) {
        val itemSpacing = 8.dp
        val horizontalContentPadding = 12.dp
        val estimatedWidth = calculateNavigationWidth(
            items = items,
            itemSpacing = itemSpacing,
            horizontalContentPadding = horizontalContentPadding
        )
        val navWidth = minOf(maxWidth, estimatedWidth)
        val widthScale = if (estimatedWidth > maxWidth) (maxWidth / estimatedWidth).coerceAtMost(1f)
        else 1f

        Box(
            modifier = Modifier
                .width(navWidth)
                // Draw shadow outside the clipped area so it isn't cut off.
                // clip=false lets the shadow bleed outside the pill boundary.
                .shadow(
                    elevation = 24.dp,
                    shape = RoundedCornerShape(30.dp),
                    clip = false,
                    ambientColor = Color.Black.copy(alpha = 0.08f),
                    spotColor = Color.Black.copy(alpha = 0.15f)
                )
                // Clip content to pill shape after the shadow has been painted.
                .clip(RoundedCornerShape(30.dp))
                // Higher opacity gives a frosted-glass feel without true backdrop blur.
                .background(MaterialTheme.colorScheme.surface.copy(alpha = 0.88f))
                .border(
                    width = 1.dp,
                    color = MaterialTheme.colorScheme.outline.copy(alpha = 0.22f),
                    shape = RoundedCornerShape(30.dp)
                )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = horizontalContentPadding, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(itemSpacing),
                verticalAlignment = Alignment.Bottom
            ) {
                items.forEach { item ->
                    val scaledWidth =
                        (estimatedItemWidth(item) * widthScale).coerceAtLeast(56.dp)
                    TravelBookBottomNavigationItem(
                        item = item,
                        selected = currentRoute == item.route,
                        onClick = { onRouteSelected(item.route) },
                        modifier = Modifier.widthIn(min = scaledWidth)
                    )
                }
            }
        }
    }
}

private fun calculateNavigationWidth(
    items: List<TravelBookNavItem>,
    itemSpacing: Dp,
    horizontalContentPadding: Dp
): Dp {
    val itemsWidth = items.fold(0.dp) { total, item -> total + estimatedItemWidth(item) }
    val spacing = itemSpacing * (items.size - 1).coerceAtLeast(0)
    return itemsWidth + spacing + (horizontalContentPadding * 2)
}

private fun estimatedItemWidth(item: TravelBookNavItem): Dp {
    if (item.isHome) return 64.dp
    return when {
        item.label.length >= 9 -> 96.dp
        item.label.length >= 7 -> 88.dp
        else -> 80.dp
    }
}

@Composable
private fun TravelBookBottomNavigationItem(
    item: TravelBookNavItem,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scale by animateFloatAsState(
        targetValue = if (selected) 1.04f else 1f,
        animationSpec = tween(durationMillis = 220),
        label = "navItemScale"
    )

    val homeLift by animateDpAsState(
        targetValue = if (item.isHome) {
            if (selected) (-6).dp else (-2).dp
        } else {
            0.dp
        },
        animationSpec = tween(durationMillis = 220),
        label = "homeLift"
    )

    val interactionSource = remember { MutableInteractionSource() }

    Column(
        modifier = modifier
            .graphicsLayer(scaleX = scale, scaleY = scale)
            .clip(RoundedCornerShape(18.dp))
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .padding(vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(2.dp)
    ) {
        if (item.isHome) {
            val homeContainerColor by androidx.compose.animation.animateColorAsState(
                targetValue = if (selected) {
                    MaterialTheme.colorScheme.secondary
                } else {
                    MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
                },
                animationSpec = tween(durationMillis = 220),
                label = "homeContainerColor"
            )

            val homeElevation by animateDpAsState(
                targetValue = if (selected) 12.dp else 4.dp,
                animationSpec = tween(durationMillis = 220),
                label = "homeElevation"
            )

            val homeSize by animateDpAsState(
                targetValue = if (selected) 52.dp else 46.dp,
                animationSpec = tween(durationMillis = 220),
                label = "homeSize"
            )

            Surface(
                modifier = Modifier
                    .offset {
                        IntOffset(
                            x = 0,
                            y = homeLift.roundToPx()
                        )
                    }
                    .size(homeSize),
                color = homeContainerColor,
                shape = RoundedCornerShape(20.dp),
                shadowElevation = homeElevation,
                tonalElevation = if (selected) 4.dp else 0.dp,
                border = BorderStroke(
                    width = 1.dp,
                    color = if (selected) {
                        MaterialTheme.colorScheme.onSecondary.copy(alpha = 0.4f)
                    } else {
                        MaterialTheme.colorScheme.secondary.copy(alpha = 0.34f)
                    }
                )
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.contentDescription,
                        tint = if (selected) {
                            Color.White
                        } else {
                            MaterialTheme.colorScheme.secondary
                        },
                        modifier = Modifier.size(22.dp)
                    )

                    androidx.compose.animation.AnimatedVisibility(
                        visible = selected && item.label.isNotBlank(),
                        enter = fadeIn(tween(160)),
                        exit = fadeOut(tween(100))
                    ) {
                        Row(modifier = Modifier.padding(top = 30.dp)) {
                            Text(
                                text = item.label,
                                style = MaterialTheme.typography.labelLarge,
                                color = MaterialTheme.colorScheme.onSecondary,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        } else {
            val iconTint by androidx.compose.animation.animateColorAsState(
                targetValue = if (selected) {
                    MaterialTheme.colorScheme.secondary
                } else {
                    MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.9f)
                },
                animationSpec = tween(durationMillis = 220),
                label = "iconTint"
            )

            val selectedBackground by androidx.compose.animation.animateColorAsState(
                targetValue = if (selected) {
                    MaterialTheme.colorScheme.secondary.copy(alpha = 0.12f)
                } else {
                    Color.Transparent
                },
                animationSpec = tween(durationMillis = 220),
                label = "selectedBackground"
            )

            val labelColor by androidx.compose.animation.animateColorAsState(
                targetValue = if (selected) {
                    MaterialTheme.colorScheme.onSurface
                } else {
                    MaterialTheme.colorScheme.onSurfaceVariant
                },
                animationSpec = tween(durationMillis = 220),
                label = "labelColor"
            )

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(14.dp))
                    .background(selectedBackground)
                    .padding(horizontal = 14.dp, vertical = 8.dp)
            ) {
                Icon(
                    imageVector = item.icon,
                    contentDescription = item.contentDescription,
                    tint = iconTint,
                    modifier = Modifier.size(21.dp)
                )
            }

            if (item.label.isNotBlank()) {
                Text(
                    text = item.label,
                    style = MaterialTheme.typography.labelLarge,
                    color = labelColor,
                    fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal,
                    textAlign = TextAlign.Center,
                    maxLines = 1
                )
            }
        }
    }
}
