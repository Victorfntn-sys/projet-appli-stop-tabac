Add-Type -AssemblyName System.Drawing

$root = "C:\Users\victo\OneDrive\Bureau\projet appli\screenshots"
$outPath = Join-Path $root "feature-graphic-1024x500-v2.png"

$width = 1024
$height = 500

$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

function New-RoundedRectPath {
    param([float]$X,[float]$Y,[float]$W,[float]$H,[float]$R)
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $R * 2
    $p.AddArc($X, $Y, $d, $d, 180, 90)
    $p.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
    $p.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
    $p.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

function Add-RoundedFill {
    param([System.Drawing.Graphics]$Graphics,[System.Drawing.Brush]$Brush,[float]$X,[float]$Y,[float]$W,[float]$H,[float]$R)
    $p = New-RoundedRectPath -X $X -Y $Y -W $W -H $H -R $R
    $Graphics.FillPath($Brush, $p)
    $p.Dispose()
}

function Add-RoundedStroke {
    param([System.Drawing.Graphics]$Graphics,[System.Drawing.Pen]$Pen,[float]$X,[float]$Y,[float]$W,[float]$H,[float]$R)
    $p = New-RoundedRectPath -X $X -Y $Y -W $W -H $H -R $R
    $Graphics.DrawPath($Pen, $p)
    $p.Dispose()
}

function Add-Phone {
    param([System.Drawing.Graphics]$Graphics,[string]$ImagePath,[float]$X,[float]$Y,[float]$W,[float]$H)

    $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(50, 8, 40, 52))
    Add-RoundedFill -Graphics $Graphics -Brush $shadow -X ($X + 8) -Y ($Y + 10) -W $W -H $H -R 26

    $frame = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(16, 60, 83))
    Add-RoundedFill -Graphics $Graphics -Brush $frame -X $X -Y $Y -W $W -H $H -R 26

    $screenPath = New-RoundedRectPath -X ($X + 10) -Y ($Y + 10) -W ($W - 20) -H ($H - 20) -R 16
    $reg = New-Object System.Drawing.Region $screenPath
    $prev = $Graphics.Clip
    $Graphics.SetClip($reg, [System.Drawing.Drawing2D.CombineMode]::Replace)

    $img = [System.Drawing.Image]::FromFile($ImagePath)
    $ir = $img.Width / $img.Height
    $tr = ($W - 20) / ($H - 20)

    if ($ir -gt $tr) {
        $dh = $H - 20
        $dw = $dh * $ir
        $dx = $X + 10 - (($dw - ($W - 20)) / 2)
        $dy = $Y + 10
    } else {
        $dw = $W - 20
        $dh = $dw / $ir
        $dx = $X + 10
        $dy = $Y + 10 - (($dh - ($H - 20)) / 2)
    }

    $Graphics.DrawImage($img, $dx, $dy, $dw, $dh)
    $Graphics.Clip = $prev

    $img.Dispose()
    $reg.Dispose()
    $screenPath.Dispose()
    $shadow.Dispose()
    $frame.Dispose()
}

$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    ([System.Drawing.Point]::new(0, 0)),
    ([System.Drawing.Point]::new($width, $height)),
    ([System.Drawing.Color]::FromArgb(245, 254, 250)),
    ([System.Drawing.Color]::FromArgb(233, 244, 250))
)
$g.FillRectangle($bg, 0, 0, $width, $height)

$teal = [System.Drawing.Color]::FromArgb(24, 145, 137)
$ink = [System.Drawing.Color]::FromArgb(21, 49, 71)
$muted = [System.Drawing.Color]::FromArgb(63, 99, 116)

$pillBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(232, 255, 255, 255))
$pillPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(74, 24, 145, 137), 1)
Add-RoundedFill -Graphics $g -Brush $pillBrush -X 36 -Y 34 -W 208 -H 44 -R 22
Add-RoundedStroke -Graphics $g -Pen $pillPen -X 36 -Y 34 -W 208 -H 44 -R 22

$icon = [System.Drawing.Image]::FromFile("C:\Users\victo\OneDrive\Bureau\projet appli\icon-192.png")
$g.DrawImage($icon, 54, 44, 22, 22)

$fBrand = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$fTitle = New-Object System.Drawing.Font("Georgia", 50, [System.Drawing.FontStyle]::Bold)
$fSub = New-Object System.Drawing.Font("Arial", 19, [System.Drawing.FontStyle]::Regular)
$fChipV = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
$fChipL = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$fFoot = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Regular)

$g.DrawString("STOP TABAC", $fBrand, (New-Object System.Drawing.SolidBrush $teal), 89, 46)
$g.DrawString("Arreter,`nsouffler,`navancer.", $fTitle, (New-Object System.Drawing.SolidBrush $ink), (New-Object System.Drawing.RectangleF(44, 96, 420, 245)))
$g.DrawString("Une app claire pour transformer chaque jour sans tabac en gain reel.", $fSub, (New-Object System.Drawing.SolidBrush $muted), (New-Object System.Drawing.RectangleF(48, 355, 460, 66)))

$chipBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(230, 255, 255, 255))
$chipPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(52, 24, 145, 137), 1)
$chips = @(
    @{X=48; Y=428; W=142; V="282,75 EUR"; L="Economises"},
    @{X=202; Y=428; W=126; V="29 jours"; L="Sans tabac"},
    @{X=340; Y=428; W=154; V="12 sessions"; L="Anti-craving"}
)
foreach ($c in $chips) {
    Add-RoundedFill -Graphics $g -Brush $chipBrush -X $c.X -Y $c.Y -W $c.W -H 58 -R 18
    Add-RoundedStroke -Graphics $g -Pen $chipPen -X $c.X -Y $c.Y -W $c.W -H 58 -R 18
    $g.DrawString($c.V, $fChipV, (New-Object System.Drawing.SolidBrush $teal), $c.X + 12, $c.Y + 10)
    $g.DrawString($c.L, $fChipL, (New-Object System.Drawing.SolidBrush $muted), $c.X + 12, $c.Y + 35)
}

Add-Phone -Graphics $g -ImagePath (Join-Path $root "02-results-progress.png") -X 552 -Y 122 -W 176 -H 318
Add-Phone -Graphics $g -ImagePath (Join-Path $root "03-craving-mode.png") -X 720 -Y 18 -W 208 -H 350
Add-Phone -Graphics $g -ImagePath (Join-Path $root "05-badges-modal.png") -X 896 -Y 172 -W 118 -H 218

$g.DrawString("Calculateur d'economies - arret du tabac", $fFoot, (New-Object System.Drawing.SolidBrush $muted), 48, 485)

$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$icon.Dispose()
$fBrand.Dispose(); $fTitle.Dispose(); $fSub.Dispose(); $fChipV.Dispose(); $fChipL.Dispose(); $fFoot.Dispose()
$bg.Dispose(); $pillBrush.Dispose(); $pillPen.Dispose(); $chipBrush.Dispose(); $chipPen.Dispose()
$g.Dispose(); $bmp.Dispose()

Write-Output $outPath
