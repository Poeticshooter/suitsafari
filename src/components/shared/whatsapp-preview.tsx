export function WhatsAppPreview({ message }: { message: string }) {
  return (
    <div className="bg-[#DCF8C6] rounded-lg p-4 max-w-sm text-sm leading-relaxed whitespace-pre-line">
      {message}
    </div>
  )
}
