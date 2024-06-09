export const filterReferenceFromResponse = (response: string) => {
  const transformations = [
    [/^\s*\[doc\d+\]/g, ""], // Loại bỏ các tham chiếu [doc]
    [/,+/g, ","], // Loại bỏ dấu phẩy thừa
    [/\s*,\s*$/g, ""], // Loại bỏ dấu phẩy cuối câu nếu có
    [/,+\s*và\s*$/g, ""], // Loại bỏ dấu phẩy và từ "và" cuối câu nếu có
    [/,+\s*and\s*$/g, ""], // Loại bỏ dấu phẩy và từ "and" cuối câu nếu có
  ];

  let filteredText = response.trim();

  transformations.forEach(([pattern, replacement]) => {
    filteredText = filteredText.replace(pattern, replacement as string);
  });

  const htmlTransformations = [
    [/^\*\*(.*?)\*\*/gm, "<strong>$1</strong>"], // **text**
    [/^\*(.*?)\*/gm, "<em>$1</em>"], // *text*
    [/^_([^_]+)_/gm, "<em>$1</em>"], // _text_
    [/^\s*\/([^/]+)\/\s*/gm, "<em>$1</em>"], // /text/
    [/^\+\+(.*?)\+\+/gm, "<u>$1</u>"], // +text+
    [/^~(.*?)~/gm, "<del>$1</del>"], // ~text~
    [/^-{2}(.*?)-{2}/gm, "<del>$1</del>"], // -text-
    [/^`([^`]*)`/gm, "<code>$1</code>"], // `text`
    [/^# (.*?)$/gm, "<h1>$1</h1>"], // Tiêu đề cấp 1
    [/^## (.*?)$/gm, "<h2>$1</h2>"], // Tiêu đề cấp 2
    [/^### (.*?)$/gm, "<h3>$1</h3>"], // Tiêu đề cấp 3
    [/^#### (.*?)$/gm, "<h4>$1</h4>"], // Tiêu đề cấp 4
    [/^##### (.*?)$/gm, "<h5>$1</h5>"], // Tiêu đề cấp 5
    [/^###### (.*?)$/gm, "<h6>$1</h6>"], // Tiêu đề cấp 6
  ];

  htmlTransformations.forEach(([pattern, replacement]) => {
    filteredText = filteredText.replace(pattern, replacement as string);
  });

  return filteredText;
};
