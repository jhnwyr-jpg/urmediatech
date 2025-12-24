import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
}

const statusConfig = {
  pending: { icon: Clock, className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  processing: { icon: Package, className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  completed: { icon: CheckCircle, className: 'bg-green-500/10 text-green-500 border-green-500/20' },
  cancelled: { icon: XCircle, className: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const RecentOrders = ({ orders, loading }: RecentOrdersProps) => {
  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
              <div className="h-6 bg-muted rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border/50 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                  <StatusIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{order.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${order.total_amount.toFixed(2)}</p>
                  <Badge variant="outline" className={cn('text-xs', config.className)}>
                    {order.status}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default RecentOrders;
