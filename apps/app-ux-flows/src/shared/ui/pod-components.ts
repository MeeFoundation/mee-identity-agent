import { AiSuggestion } from './ai-suggestion'
import { AppTabBar } from './app-tab-bar'
import { AttachmentList } from './attachment-list'
import { AttachmentRow } from './attachment-row'
import { BottomSheet } from './bottom-sheet'
import { CardWithAction } from './card-with-action'
import { CategoryRow } from './category-row'
import { CountBadge } from './count-badge'
import { Divider } from './divider'
import { EmptyStateCard } from './empty-state-card'
import { FloatingActionButton } from './floating-action-button'
import { FieldRow, FormCard } from './form-card'
import { HomeTopBar } from './home-top-bar'
import { InlineFieldEditor } from './inline-field-editor'
import { MemberCard, MemberRow } from './member-row'
import { PodScreen } from './pod-screen'
import { PodTopBar } from './pod-top-bar'
import { RadioGroupField } from './radio-group-field'
import { RecordRow } from './record-row'
import { SectionLabel } from './section-label'
import { SegmentedTabs } from './segmented-tabs'
import { SelectField } from './select-field'
import { SheetActionList } from './sheet-action-list'
import { Toast } from './toast'

export const podComponents = {
  AiSuggestion,
  AppTabBar,
  AttachmentList,
  AttachmentRow,
  BottomSheet,
  CardWithAction,
  CategoryRow,
  CountBadge,
  Divider,
  EmptyStateCard,
  FieldRow,
  FloatingActionButton,
  FormCard,
  HomeTopBar,
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
  SheetActionList,
  Toast,
}

export type PodComponents = typeof podComponents
