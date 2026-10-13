type ChatTypingIndicatorProps = {
  // Who is typing, without the ellipsis, for example "Telli is typing".
  label: string
}

const dotDelays = ['[animation-delay:0ms]', '[animation-delay:200ms]', '[animation-delay:400ms]']

// After the Mee Design System chat item "Typing message", with an animated ellipsis.
export const ChatTypingIndicator = ({ label }: ChatTypingIndicatorProps) => (
  <p className="flex h-9 items-center text-gray-950/60 text-xs tracking-[0.06px]">
    {label}
    <span aria-hidden className="inline-flex">
      {dotDelays.map((delay) => (
        <span className={`animate-pulse motion-reduce:animate-none ${delay}`} key={delay}>
          .
        </span>
      ))}
    </span>
  </p>
)
