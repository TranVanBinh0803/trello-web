export namespace SchemaUtils {
  export const validator = {
    // Ref: https://melvingeorge.me/blog/remove-all-html-tags-from-string-javascript
    isNonEmptyHtml: (str: string) => !!str.replace(/(<([^>]+)>)/gi, '').trim(),
    isNonEmptyString: (str: string) => !!str.trim(),
    isNonNullFile: (file: File | null) => file !== null,
    isNonEmptyArray: (arr: string[]) => arr.length > 0,
  };

  export const message = {
    nonempty: 'Vui lòng không bỏ trống',
    invalidEmail: 'Email không hợp lệ',
    invalidLink: 'Liên kết không hợp lệ',
    invalidNumber: 'Vui lòng nhập giá trị số',
    invalidIdentifycationNumber: 'Mã số thuế phải gồm 10 hoặc 13 chữ số',
    invalidPhone: 'Số điện thoại không hợp lệ',
  };
}
