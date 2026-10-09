type ChatMessageStatusProps = {
  label: string
}

// The delivery line under the user's latest message, after the Mee Design System chat item "Me".
export const ChatMessageStatus = ({ label }: ChatMessageStatusProps) => (
  <p className="-mt-1.5 self-end px-1.5 text-gray-950/60 text-xs tracking-[0.06px]">{label}</p>
)
