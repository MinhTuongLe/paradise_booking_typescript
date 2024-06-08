export const filterReferenceFromResponse = (response: string) => {
  const filteredText = response
    .replace(/\s*\[doc\d+\]/g, "") // Loại bỏ các tham chiếu [doc]
    .replace(/,\s*,/g, ",") // Loại bỏ dấu phẩy thừa
    .replace(/\s*,\s*$/, "") // Loại bỏ dấu phẩy cuối câu nếu có
    .replace(/,\s*$/, "") // Loại bỏ dấu phẩy cuối câu nếu có
    .replace(/,\s*và\s*$/, "") // Loại bỏ dấu phẩy và từ "và" cuối câu nếu có
    .replace(/,\s*and\s*$/, "") // Loại bỏ dấu phẩy và từ "and" cuối câu nếu có
    .trim();

  return filteredText;
};
