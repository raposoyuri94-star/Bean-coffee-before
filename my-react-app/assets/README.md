# Image sources

`originals/` keeps the eight original PNG images used by the website. This
folder is outside `public/`, so Vite does not copy these large files into a
deployment.

The website loads WebP versions from `public/` at their original dimensions.
Photos use quality 84; the story illustration uses quality 90 to preserve
detail. Keep the originals when replacing or re-encoding images. The small brand
logo stays in its original JPEG format.
