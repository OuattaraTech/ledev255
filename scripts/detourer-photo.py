#!/usr/bin/env python3
"""
Détoure une photo de profil : supprime le fond et exporte un WebP transparent.

Utilisation :
    python3 scripts/detourer-photo.py public/imgs/ma_photo.jpg

Produit `<nom>_cut.webp` à côté du fichier source, puis il suffit de
pointer `identity.photoCut` dessus dans src/data/content.ts.

Dépendances : pip install onnxruntime pillow numpy
Le modèle de segmentation (168 Mo) est téléchargé une seule fois dans
~/.cache/portfolio-cutout/ .
"""

import sys
import urllib.request
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

MODEL_URL = (
    "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net_human_seg.onnx"
)
CACHE = Path.home() / ".cache" / "portfolio-cutout"
MODEL = CACHE / "u2net_human_seg.onnx"

MEAN = (0.485, 0.456, 0.406)
STD = (0.229, 0.224, 0.225)
MAX_SIDE = 1200


def get_model() -> Path:
    if MODEL.exists():
        return MODEL
    CACHE.mkdir(parents=True, exist_ok=True)
    print(f"Téléchargement du modèle ({MODEL_URL})…")
    urllib.request.urlretrieve(MODEL_URL, MODEL)
    print(f"Modèle enregistré dans {MODEL}")
    return MODEL


def alpha_mask(src: Image.Image) -> Image.Image:
    im = src.resize((320, 320), Image.LANCZOS)
    a = np.array(im).astype(np.float32)
    a /= max(a.max(), 1e-6)
    t = np.zeros((320, 320, 3), dtype=np.float32)
    for c in range(3):
        t[:, :, c] = (a[:, :, c] - MEAN[c]) / STD[c]
    t = t.transpose(2, 0, 1)[None, ...]

    sess = ort.InferenceSession(str(get_model()), providers=["CPUExecutionProvider"])
    pred = sess.run(None, {sess.get_inputs()[0].name: t})[0][:, 0, :, :]
    pred = (pred - pred.min()) / (pred.max() - pred.min() + 1e-8)

    return Image.fromarray((pred.squeeze() * 255).astype("uint8"), "L").resize(
        src.size, Image.LANCZOS
    )


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 1

    path = Path(sys.argv[1])
    if not path.exists():
        print(f"Fichier introuvable : {path}")
        return 1

    src = Image.open(path).convert("RGB")
    cut = src.copy()
    cut.putalpha(alpha_mask(src))

    # recadrage sur le sujet
    box = cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if box:
        pad = 6
        cut = cut.crop(
            (
                max(0, box[0] - pad),
                max(0, box[1] - pad),
                min(cut.width, box[2] + pad),
                min(cut.height, box[3] + pad),
            )
        )

    w, h = cut.size
    if max(w, h) > MAX_SIDE:
        s = MAX_SIDE / max(w, h)
        cut = cut.resize((round(w * s), round(h * s)), Image.LANCZOS)

    out = path.with_name(path.stem + "_cut.webp")
    cut.save(out, format="WEBP", quality=90, method=6)
    print(f"Écrit : {out}  ({cut.size[0]}×{cut.size[1]}, {out.stat().st_size // 1024} Ko)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
