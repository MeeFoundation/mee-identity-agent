import { AiSuggestion } from './ai-suggestion'
import { AppTabBar } from './app-tab-bar'
import { BottomSheet } from './bottom-sheet'
import { CardWithAction } from './card-with-action'
import { CategoryRow } from './category-row'
import { Divider } from './divider'
import { EmptyStateCard } from './empty-state-card'
import { FieldRow, FormCard } from './form-card'
import { PodScreen } from './pod-screen'
import { PodTopBar } from './pod-top-bar'
import { RecordRow } from './record-row'
import { SectionLabel } from './section-label'
import { SegmentedTabs } from './segmented-tabs'
import { SelectField } from './select-field'

export const podComponents = {
  AiSuggestion,
  AppTabBar,
  BottomSheet,
  CardWithAction,
  CategoryRow,
  Divider,
  EmptyStateCard,
  FieldRow,
  FormCard,
  PodScreen,
  PodTopBar,
  RecordRow,
  SectionLabel,
  SegmentedTabs,
  SelectField,
}

export type PodComponents = typeof podComponents
