import { BriefingContent, type BriefingProps } from './briefing-content'

// The desktop side panel; at phone widths the panel is hidden and `BriefingButton` takes over.
export const BriefingPanel = (props: BriefingProps) => (
  <div className="col-span-3 w-full rounded-2xl border border-gray-200 bg-white p-4 max-[480px]:hidden lg:mt-4">
    <BriefingContent {...props} />
  </div>
)
