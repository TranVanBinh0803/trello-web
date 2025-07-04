export namespace HelperUtils {
  export const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  export const isEmpty = (value: any) => {
    if (
      typeof value === "undefined" ||
      value === null ||
      value === "" ||
      value.length === 0
    ) {
      return true;
    }
    return false;
  };

  export const getFileType = (filename: string) => {
    const parts = filename.split(".");
    if (parts.length > 1) {
      return parts.pop()?.toLowerCase() || "";
    }
    return "";
  };
  export const IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "ico",
    "tiff",
    "tif",
  ];

  export const isImage = (filename: string): boolean => {
    const extension = getFileType(filename);
    return IMAGE_EXTENSIONS.includes(extension);
  };

  export const getImageAttachments = (attachments: any[]): any[] => {
    if (!attachments || !Array.isArray(attachments)) return [];
    return attachments.filter(
      (attachment) => attachment.fileName && isImage(attachment.fileName)
    );
  };
  export const encodeImageUrl = (url: any) => {
    if (url.includes('%')) {
      return url;
    }
    
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const encodedFilename = encodeURIComponent(filename);
    
    urlParts[urlParts.length - 1] = encodedFilename;
    return urlParts.join('/');
  };
}
