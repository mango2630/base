enum CallMediaType {
  UNKNOWN,
  AUDIO,
  VIDEO,
}

const CallType = {
  'audio': CallMediaType.AUDIO,
  'video': CallMediaType.VIDEO,
} as const;

const a = CallType[CallMediaType.UNKNOWN]
console.log(a);
