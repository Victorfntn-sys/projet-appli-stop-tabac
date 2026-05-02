Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$root = "C:\Users\victo\OneDrive\Bureau\projet appli\screenshots"
$outPath = Join-Path $root "feature-graphic-1024x500.png"

$width = 1024
$height = 500

$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::FromArgb(244, 251, 248))

function New-RoundedRectPath {
    param(
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $Radius * 2
    $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
    $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
    $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function Add-RoundedRectFill {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Brush]$Brush,
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )
    $path = New-RoundedRectPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
    $Graphics.FillPath($Brush, $path)
    $path.Dispose()
}

function Add-RoundedRectStroke {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Pen]$Pen,
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )
    $path = New-RoundedRectPath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
    $Graphics.DrawPath($Pen, $path)
    $path.Dispose()
}

$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    ([System.Drawing.Point]::new(0, 0)),
    ([System.Drawing.Point]::new($width, $height)),
    ([System.Drawing.Color]::FromArgb(248, 255, 253)),
    ([System.Drawing.Color]::FromArgb(237, 247, 251))
)
$graphics.FillRectangle($bgBrush, 0, 0, $width, $height)

$teal = [System.Drawing.Color]::FromArgb(24, 118, 121)
$ink = [System.Drawing.Color]::FromArgb(20, 50, 69)
$soft = [System.Drawing.Color]::FromArgb(66, 98, 112)
$line = [System.Drawing.Color]::FromArgb(50, 30, 159, 151)
$badgeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 255, 255, 255))
$badgePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(70, 30, 159, 151), 1)
Add-RoundedRectFill -Graphics $graphics -Brush $badgeBrush -X 38 -Y 36 -Width 170 -Height 44 -Radius 20
Add-RoundedRectStroke -Graphics $graphics -Pen $badgePen -X 38 -Y 36 -Width 170 -Height 44 -Radius 20

$iconPath = "C:\Users\victo\OneDrive\Bureau\projet appli\icon-192.png"
$icon = [System.Drawing.Image]::FromFile($iconPath)
$graphics.DrawImage($icon, 56, 45, 24, 24)

$brandFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$graphics.DrawString("STOP TABAC", $brandFont, (New-Object System.Drawing.SolidBrush $teal), 90, 47)

$titleFont = New-Object System.Drawing.Font("Georgia", 36, [System.Drawing.FontStyle]::Bold)
$subtitleFont = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
$statValueFont = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Bold)
$statLabelFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font("Arial", 17, [System.Drawing.FontStyle]::Regular)
$footerFont = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Regular)

$graphics.DrawString("Arreter de`nfumer,`nvoir ses gains.", $titleFont, (New-Object System.Drawing.SolidBrush $ink), (New-Object System.Drawing.RectangleF(42, 92, 445, 188)))
$graphics.DrawString("Suivi des economies, objectif d'epargne, mode urgence et progression concrete.", $subtitleFont, (New-Object System.Drawing.SolidBrush $soft), (New-Object System.Drawing.RectangleF(46, 340, 380, 70)))

$statBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(225, 255, 255, 255))
$statPen = New-Object System.Drawing.Pen ($line, 1)
$stats = @(
    @{ X = 46; Y = 410; W = 124; H = 62; Value = "282,75 EUR"; Label = "Economises" },
    @{ X = 182; Y = 410; W = 118; H = 62; Value = "29 jours"; Label = "Sans tabac" },
    @{ X = 312; Y = 410; W = 126; H = 62; Value = "12 sessions"; Label = "Anti-craving" }
)
foreach ($stat in $stats) {
    Add-RoundedRectFill -Graphics $graphics -Brush $statBrush -X $stat.X -Y $stat.Y -Width $stat.W -Height $stat.H -Radius 18
    Add-RoundedRectStroke -Graphics $graphics -Pen $statPen -X $stat.X -Y $stat.Y -Width $stat.W -Height $stat.H -Radius 18
    $graphics.DrawString($stat.Value, $statValueFont, (New-Object System.Drawing.SolidBrush $teal), $stat.X + 12, $stat.Y + 10)
    $graphics.DrawString($stat.Label, $statLabelFont, (New-Object System.Drawing.SolidBrush $soft), $stat.X + 12, $stat.Y + 37)
}

$pointBrush = New-Object System.Drawing.SolidBrush $soft
$accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 159, 151))
$points = @(
    "Objectifs financiers motivants",
    "Rappels utiles sans surcharge",
    "Suivi sante et rechutes sans culpabilite"
)
for ($i = 0; $i -lt $points.Count; $i++) {
    $y = 316 + ($i * 28)
    $graphics.FillEllipse($accentBrush, 432, $y + 6, 9, 9)
    $graphics.DrawString($points[$i], $bodyFont, $pointBrush, 450, $y)
}

function Add-PhoneCard {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$ImagePath,
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height
    )

    $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 10, 47, 65))
    Add-RoundedRectFill -Graphics $Graphics -Brush $shadowBrush -X ($X + 8) -Y ($Y + 12) -Width $Width -Height $Height -Radius 28

    $frameBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(27, 55, 71))
    Add-RoundedRectFill -Graphics $Graphics -Brush $frameBrush -X $X -Y $Y -Width $Width -Height $Height -Radius 28

    $screenPath = New-RoundedRectPath -X ($X + 12) -Y ($Y + 12) -Width ($Width - 24) -Height ($Height - 24) -Radius 18
    $screenRegion = New-Object System.Drawing.Region $screenPath
    $oldClip = $Graphics.Clip
    $Graphics.SetClip($screenRegion, [System.Drawing.Drawing2D.CombineMode]::Replace)

    $img = [System.Drawing.Image]::FromFile($ImagePath)
    $imgRatio = $img.Width / $img.Height
    $targetRatio = ($Width - 24) / ($Height - 24)
    if ($imgRatio -gt $targetRatio) {
        $drawHeight = $Height - 24
        $drawWidth = $drawHeight * $imgRatio
        $drawX = $X + 12 - (($drawWidth - ($Width - 24)) / 2)
        $drawY = $Y + 12
    } else {
        $drawWidth = $Width - 24
        $drawHeight = $drawWidth / $imgRatio
        $drawX = $X + 12
        $drawY = $Y + 12 - (($drawHeight - ($Height - 24)) / 2)
    }
    $Graphics.DrawImage($img, $drawX, $drawY, $drawWidth, $drawHeight)
    $Graphics.Clip = $oldClip

    $screenRegion.Dispose()
    $screenPath.Dispose()
    $img.Dispose()
}

Add-PhoneCard -Graphics $graphics -ImagePath (Join-Path $root "02-results-progress.png") -X 558 -Y 120 -Width 175 -Height 320
Add-PhoneCard -Graphics $graphics -ImagePath (Join-Path $root "03-craving-mode.png") -X 718 -Y 18 -Width 205 -Height 352
Add-PhoneCard -Graphics $graphics -ImagePath (Join-Path $root "05-badges-modal.png") -X 882 -Y 172 -Width 118 -Height 220

$graphics.DrawString("Calculateur d'economies - arret du tabac", $footerFont, (New-Object System.Drawing.SolidBrush $soft), 44, 476)

$bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$icon.Dispose()
$brandFont.Dispose()
$titleFont.Dispose()
$subtitleFont.Dispose()
$statValueFont.Dispose()
$statLabelFont.Dispose()
$bodyFont.Dispose()
$footerFont.Dispose()
$bgBrush.Dispose()
$badgeBrush.Dispose()
$badgePen.Dispose()
$statBrush.Dispose()
$statPen.Dispose()
$pointBrush.Dispose()
$accentBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output $outPath
