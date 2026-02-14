import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { Plus, Calendar } from 'lucide-react'

export default function PMPlanList() {
  const pmPlans = useStore((state) => state.pmPlans)
  const assets = useStore((state) => state.assets)
  const users = useStore((state) => state.users)

  const getAssetName = (assetId: string) => {
    return assets.find((a) => a.id === assetId)?.name || 'Unknown Asset'
  }

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned'
    return users.find((u) => u.id === userId)?.name || 'Unknown'
  }

  const activePlans = pmPlans.filter((p) => p.isActive)

  return (
    <div>
      <PageHeader
        title="PM Plans"
        description="Preventive maintenance schedules"
        action={{
          label: 'New PM Plan',
          onClick: () => {},
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activePlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{plan.name}</h3>
                <Badge variant="default" className="capitalize">
                  {plan.frequency}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Asset</span>
                  <span className="font-medium">{getAssetName(plan.assetId)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assignee</span>
                  <span className="font-medium">{getUserName(plan.assigneeId)}</span>
                </div>
                {plan.lastPerformed && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Performed</span>
                    <span>{formatDate(plan.lastPerformed)}</span>
                  </div>
                )}
                {plan.nextDue && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Next Due
                    </span>
                    <span className="font-medium">{formatDate(plan.nextDue)}</span>
                  </div>
                )}
              </div>

              {plan.taskList.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Tasks ({plan.taskList.length})</p>
                  <ul className="text-xs space-y-1">
                    {plan.taskList.slice(0, 3).map((task, index) => (
                      <li key={index} className="text-muted-foreground">• {task}</li>
                    ))}
                    {plan.taskList.length > 3 && (
                      <li className="text-muted-foreground">+ {plan.taskList.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {activePlans.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No active PM plans</p>
          </div>
        )}
      </div>
    </div>
  )
}
