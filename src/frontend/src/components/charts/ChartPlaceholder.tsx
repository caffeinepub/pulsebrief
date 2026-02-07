import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ChartPlaceholderProps {
  title: string;
  description: string;
}

export default function ChartPlaceholder({ title, description }: ChartPlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-32 rounded-lg bg-muted/50 flex items-center justify-center">
          <div className="text-center space-y-2">
            <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">Chart visualization</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
