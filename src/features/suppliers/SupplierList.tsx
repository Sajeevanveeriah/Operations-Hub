import { useStore } from '@/store'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, Mail, Phone, Star } from 'lucide-react'

export default function SupplierList() {
  const suppliers = useStore((state) => state.suppliers)

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage supplier directory"
        action={{
          label: 'Add Supplier',
          onClick: () => {},
          icon: <Plus className="h-4 w-4 mr-2" />,
        }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{supplier.name}</h3>
                  {supplier.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{supplier.phone}</span>
                </div>
                <p className="text-muted-foreground">{supplier.address}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {supplier.categories.map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>

              {supplier.notes && (
                <p className="mt-3 text-xs text-muted-foreground border-t pt-3">
                  {supplier.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
