import { UserDocument } from '@entities/user'
import { GoalDocument } from '@entities/goal'

export interface InviteDocument {
  id: string|number
  from: UserDocument
  to: UserDocument
  goal: GoalDocument
  createdAt: number
  disabled: boolean
}
