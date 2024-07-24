import { useEffect, useState } from "react";

import ImagePreviewModal, { PreviewImageData } from "./ImagePreviewModal";

type Props = {
  context?: "chat" | "markdown";
};

const ImagePreview = ({ context = "chat" }: Props) => {
  const [previewImage, setPreviewImage] = useState<PreviewImageData | null>(null);
  const closePreviewModal = () => {
    setPreviewImage(null);
  };
  useEffect(() => {
    const container = document.querySelector("#CHAT_WRAPPER") as HTMLDivElement;
    if (!container) return;
    const chatHandler = (evt: MouseEvent) => {
      const target = evt.target as HTMLImageElement;
      console.log({ target });

      if (!target) return;
      if (target.nodeName == "IMG" && target.classList.contains("preview")) {
        const thumbnail = target.src;
        const originUrl = target.dataset.origin || target.src;
        const downloadLink = target.dataset.download || target.src;
        const meta = JSON.parse(target.dataset.meta || "{}");
        setPreviewImage({ thumbnail, originUrl, downloadLink, ...meta });
      }
    };
    const markdownHandler = (evt: MouseEvent) => {
      evt.stopPropagation();
      const target = evt.target as HTMLImageElement;
      if (!target) return;
      // 图片 并且没被 a 标签包裹
      if (target.nodeName == "IMG" && target.parentElement?.tagName !== "A") {
        const urlObj = new URL(target.src);
        const originUrl = `${urlObj.origin}${urlObj.pathname}?file_path=${urlObj.searchParams.get(
          "file_path"
        )}`;
        const thumbnail = `${urlObj.origin}${urlObj.pathname}?file_path=${urlObj.searchParams.get(
          "file_path"
        )}&thumbnail=true`;
        const downloadLink = `${urlObj.origin}${
          urlObj.pathname
        }?file_path=${urlObj.searchParams.get("file_path")}&download=true`;
        const data = { originUrl, downloadLink, thumbnail };
        setPreviewImage(data);
      }
    };

    const handler = context == "chat" ? chatHandler : markdownHandler;
    // 点击查看大图
    container.addEventListener("click", handler, true);
    return () => {
      container.removeEventListener("click", handler, true);
    };
  }, [context]);
  return previewImage ? (
    <ImagePreviewModal download={true} data={previewImage} closeModal={closePreviewModal} />
  ) : null;
};

export default ImagePreview;
