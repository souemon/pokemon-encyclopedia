// 「図鑑No.」を取得する関数
const extractIdFromUrl = (url: string): string => {
  const id = url.split("/").filter(Boolean).pop()!;
  return id;
};

// 日本語名を取得する関数
const getJapaneseValue = (
  languageArray: Genera | Names | Type | Ability
): string | undefined => {
  let getJapaneseValue;
  if ("genus" in languageArray[0]) {
    const genera = languageArray as Genera;
    getJapaneseValue = genera.find(
      (data) => data.language.name === "ja"
    )!.genus;
  }
  if ("name" in languageArray[0]) {
    const genera = languageArray as Names | Type | Ability;
    getJapaneseValue = genera.find((data) => data.language.name === "ja")!.name;
  }
  return getJapaneseValue ? getJapaneseValue : undefined;
};

export { extractIdFromUrl, getJapaneseValue };
