import type { FC, ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Card, CardChevron } from './Card'
import { CellInfo } from './CellInfo'
import { PencilIcon, PersonVideoIcon, PlusIcon } from './icons'

const styles = StyleSheet.create({
  count: {
    alignItems: 'center',
    backgroundColor: '#DFECEE',
    borderColor: '#4F868E',
    borderRadius: 9999,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
  },
  countRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  countText: {
    color: '#3B5B63',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  emptyBody: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  emptyDescription: {
    color: '#1E293B',
    fontFamily: 'PublicSans_400Regular',
    fontSize: 14,
    letterSpacing: 0.07,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#0F172A',
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.08,
    lineHeight: 24,
    textAlign: 'center',
  },
  rows: {
    paddingHorizontal: 12,
  },
  story: {
    backgroundColor: '#F1F5F9',
    padding: 16,
  },
})

export const storyStyles = styles

export const FormRows: FC<{ children: ReactNode }> = ({ children }) => <View style={styles.rows}>{children}</View>

type FormRow = { label: string; value: string }

const contactRows: FormRow[] = [
  { label: 'First name', value: 'Sofia' },
  { label: 'Last name', value: 'Walker' },
  { label: 'Date of birth', value: 'April 8, 2018' },
]

type FormCardProps = {
  addLabel?: string
  defaultExpanded?: boolean
  rows?: FormRow[]
  title?: string
}

export const FormCard: FC<FormCardProps> = ({
  addLabel = 'Add contact info',
  defaultExpanded = true,
  rows = contactRows,
  title = 'Contact info',
}) => (
  <Card
    defaultExpanded={defaultExpanded}
    footer={{ icon: <PlusIcon />, label: addLabel, onPress: () => undefined, variant: 'outline' }}
    header={({ expanded, toggle }) => (
      <CellInfo
        accessibilityState={{ expanded }}
        icon={<PersonVideoIcon />}
        name={title}
        onPress={toggle}
        trailing={<CardChevron expanded={expanded} />}
        variant="mini-group"
      />
    )}
  >
    <FormRows>
      {rows.map((row) => (
        <CellInfo key={row.label} label={row.label} trailing={<PencilIcon />} value={row.value} variant="info" />
      ))}
    </FormRows>
  </Card>
)

export const EmptyFormsCard = () => (
  <Card>
    <View style={styles.emptyBody}>
      <Text style={styles.emptyTitle}>You have no forms yet</Text>
      <Text style={styles.emptyDescription}>Forms help you hold this pod's info.</Text>
    </View>
  </Card>
)

export const Count: FC<{ value: number }> = ({ value }) => (
  <View style={styles.count}>
    <Text style={styles.countText}>{value}</Text>
  </View>
)
