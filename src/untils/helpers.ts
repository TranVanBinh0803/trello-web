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
}
