// Korean profanity filter with common inappropriate words and spam patterns
const koreanProfanityWords = [
  // Common Korean profanity (abbreviated for production safety)
  "시발", "씨발", "개새끼", "병신", "미친", "또라이", "바보", "멍청",
  "존나", "좆", "꺼져", "죽어", "닥쳐", "염병", "쓰레기", "개놈",
  // Spam patterns
  "돈벌기", "부업", "대출", "홍보", "광고", "클릭", "http", "www",
  "카톡", "카카오톡", "텔레그램", "인스타", "페이스북", "링크",
  // Commercial spam
  "무료", "공짜", "이벤트", "당첨", "할인", "쿠폰", "포인트",
];

const spamPatterns = [
  /\d{3}-\d{4}-\d{4}/, // Phone numbers
  /\d{2,3}-\d{3,4}-\d{4}/, // Phone numbers variations
  /010[\s-]?\d{4}[\s-]?\d{4}/, // Mobile numbers
  /http[s]?:\/\//, // URLs
  /www\./, // URLs
  /\.com/, // URLs
  /\.kr/, // URLs
  /카톡|카카오톡/i, // KakaoTalk
  /텔레그램/i, // Telegram
  /인스타그램?/i, // Instagram
  /페이스북/i, // Facebook
  /유튜브/i, // YouTube
  /대출|돈벌기|부업|홍보|광고/i, // Spam keywords
];

export function filterProfanity(text: string): string {
  let filteredText = text;

  // Replace profanity words with asterisks
  koreanProfanityWords.forEach((word) => {
    const regex = new RegExp(word, "gi");
    filteredText = filteredText.replace(regex, "*".repeat(word.length));
  });

  // Replace spam patterns
  spamPatterns.forEach((pattern) => {
    filteredText = filteredText.replace(pattern, (match) => "*".repeat(match.length));
  });

  return filteredText;
}

export function containsProfanity(text: string): boolean {
  // Check for profanity words
  const hasProfanity = koreanProfanityWords.some((word) => {
    const regex = new RegExp(word, "i");
    return regex.test(text);
  });

  if (hasProfanity) return true;

  // Check for spam patterns
  const hasSpam = spamPatterns.some((pattern) => pattern.test(text));

  return hasSpam;
}

export function getFilterReason(text: string): string {
  // Check specific types of violations
  if (spamPatterns.some((pattern) => pattern.test(text))) {
    return "스팸 또는 홍보성 내용이 감지되었습니다.";
  }

  if (koreanProfanityWords.some((word) => new RegExp(word, "i").test(text))) {
    return "부적절한 언어가 감지되었습니다.";
  }

  return "내용 검토가 필요합니다.";
}

// Advanced spam detection using patterns and heuristics
export function isSpamContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for excessive special characters
  const specialCharRatio = (text.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/g) || []).length / text.length;
  if (specialCharRatio > 0.3) return true;

  // Check for repeated characters
  if (/(.)\1{4,}/.test(text)) return true;

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /무료.*체험/i,
    /100%.*보장/i,
    /지금.*신청/i,
    /한정.*이벤트/i,
    /급전.*필요/i,
    /대출.*가능/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(lowerText));
}
