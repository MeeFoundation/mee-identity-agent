import { DoseHistoryView } from '../../../pods/ginger/components/dose-history-view'

const noop = () => {}

export const DoseHistoryScreen = () => <DoseHistoryView onFilter={noop} onMenu={noop} onMoreShown={noop} />
