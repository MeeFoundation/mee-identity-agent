import { AiSuggestion } from './ai-suggestion'
import { AppTabBar } from './app-tab-bar'
import { BottomSheet } from './bottom-sheet'
import { CardWithAction } from './card-with-action'
import { CategoryRow } from './category-row'
import { CountBadge } from './count-badge'
import { Divider } from './divider'
import { EmptyStateCard } from './empty-state-card'
import { FieldRow, FormCard } from './form-card'
import { InlineFieldEditor } from './inline-field-editor'
import { MemberCard, MemberRow } from './member-row'
import { PodScreen } from './pod-screen'
import { PodTopBar } from './pod-top-bar'
import { RadioGroupField } from './radio-group-field'
import { RecordRow } from './record-row'
import { SectionLabel } from './section-label'
import { SegmentedTabs } from './segmented-tabs'
import { SelectField } from './select-field'
import { Toast } from './toast'

export const podComponents = {
  AiSuggestion,
  AppTabBar,
  BottomSheet,
  CardWithAction,
  CategoryRow,
  CountBadge,
  Divider,
  EmptyStateCard,
  FieldRow,
  FormCard,
  InlineFieldEditor,
  MemberCard,
  MemberRow,
  PodScreen,
  PodTopBar,
  RadioGroupField,
  RecordRow,
  SectionLabel,
  SegmentedTabs,
  SelectField,
  Toast,
}

export type PodComponents = typeof podComponents
