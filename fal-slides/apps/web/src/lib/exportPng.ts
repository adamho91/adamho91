/** Lightweight DOM → PNG via SVG foreignObject (no extra dependency). */
export async function toPng(node: HTMLElement): Promise<string> {
  const width = 1920;
  const height = 1080;
  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;

  // Replace canvases with images
  const srcCanvases = node.querySelectorAll("canvas");
  const dstCanvases = clone.querySelectorAll("canvas");
  srcCanvases.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = (src as HTMLCanvasElement).toDataURL("image/png");
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.display = "block";
    dstCanvases[i]?.replaceWith(img);
  });

  const serializer = new XMLSerializer();
  const xhtml = serializer.serializeToString(clone);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;font-family:sans-serif;">
      ${xhtml}
    </div>
  </foreignObject>
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no ctx");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
