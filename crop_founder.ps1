Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\AKHIL KUMAR\OneDrive\Desktop\patient care\assets\images\founder.png"
$dstPath = "C:\Users\AKHIL KUMAR\OneDrive\Desktop\patient care\assets\images\founder.png"

# Load original image
$original = [System.Drawing.Image]::FromFile($srcPath)
$origW = $original.Width
$origH = $original.Height

Write-Host "Original: $origW x $origH"

# Crop: remove black bars top (~7%) and bottom (~25%) to focus on face + upper body
$cropTop    = [int]($origH * 0.07)   # skip black bar at top
$cropBottom = [int]($origH * 0.28)   # remove lower legs/feet
$cropLeft   = 0
$cropRight  = 0

$newW = $origW - $cropLeft - $cropRight
$newH = $origH - $cropTop - $cropBottom

Write-Host "Cropped to: $newW x $newH (top=$cropTop, removed_bottom=$cropBottom)"

# Create destination bitmap
$bmp = New-Object System.Drawing.Bitmap($newW, $newH)
$g   = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($original, 0, 0, (New-Object System.Drawing.Rectangle($cropLeft, $cropTop, $newW, $newH)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$original.Dispose()

# Save - must save to temp then overwrite
$tmpPath = $dstPath + ".tmp.png"
$bmp.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

# Replace original
if (Test-Path $dstPath) { Remove-Item $dstPath -Force }
Move-Item $tmpPath $dstPath

Write-Host "Done! Saved cropped image to: $dstPath"
