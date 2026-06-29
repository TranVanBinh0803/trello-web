export namespace SchemaUtils {
  export const validator = {
    // Ref: https://melvingeorge.me/blog/remove-all-html-tags-from-string-javascript
    isNonEmptyHtml: (str: string) => !!str.replace(/(<([^>]+)>)/gi, "").trim(),
    isNonEmptyString: (str: string) => !!str.trim(),
    isValidEmail: (str: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim()),
    isValidUrl: (str: string) => {
      try {
        const url = new URL(str.trim());
        return ["http:", "https:"].includes(url.protocol);
      } catch {
        return false;
      }
    },
    isNonNullFile: (file: File | null) => file !== null,
    isNonEmptyArray: (arr: string[]) => arr.length > 0,
  };

  export const message = {
    nonempty: "This field is required",
    invalidEmail: "Invalid email",
    invalidLink: "Invalid link",
    invalidNumber: "Please enter a numeric value",
    invalidPhone: "Invalid phone number",
  };
}
