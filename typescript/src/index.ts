import './01-base'

enum CallMediaType {
  UNKNOWN,
  AUDIO,
  VIDEO,
}

const CallType = {
  'unknown': CallMediaType.UNKNOWN,
  'audio': CallMediaType.AUDIO,
  'video': CallMediaType.VIDEO,
} as const;



const a = CallType['unknown']
console.log(a);