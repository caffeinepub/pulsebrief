import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { usePortfolioQueries } from '@/queries/portfolioQueries';
import { toast } from 'sonner';
import { useRequirePrototypeSignIn } from '@/hooks/useRequirePrototypeSignIn';

const TIME_HORIZONS = ['Trader', '6 months', '2 years'];

export default function AssetEditor() {
  const { requireSignIn } = useRequirePrototypeSignIn();
  const { addAssetMutation } = usePortfolioQueries(true);
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [allocation, setAllocation] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('6 months');
  const [entryPrice, setEntryPrice] = useState('');

  const handleAdd = () => {
    // Require sign-in to add assets
    if (!requireSignIn('save a portfolio')) {
      return;
    }

    if (!name || !ticker || !allocation) {
      toast.error('Please fill in required fields');
      return;
    }

    const allocationNum = parseInt(allocation);
    if (isNaN(allocationNum) || allocationNum < 0 || allocationNum > 100) {
      toast.error('Allocation must be between 0 and 100');
      return;
    }

    addAssetMutation.mutate(
      {
        name,
        ticker: ticker.toUpperCase(),
        allocation: BigInt(allocationNum),
        timeHorizon,
        averageEntryPrice: entryPrice ? BigInt(Math.floor(parseFloat(entryPrice) * 100)) : null,
      },
      {
        onSuccess: () => {
          toast.success('Asset added successfully');
          setName('');
          setTicker('');
          setAllocation('');
          setEntryPrice('');
        },
        onError: () => {
          toast.error('Failed to add asset');
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Asset Name *</Label>
          <Input
            id="name"
            placeholder="Bitcoin"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ticker">Ticker *</Label>
          <Input
            id="ticker"
            placeholder="BTC"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="allocation">Allocation % *</Label>
          <Input
            id="allocation"
            type="number"
            min="0"
            max="100"
            placeholder="25"
            value={allocation}
            onChange={(e) => setAllocation(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horizon">Time Horizon</Label>
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger id="horizon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_HORIZONS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="entry">Entry Price (optional)</Label>
          <Input
            id="entry"
            type="number"
            step="0.01"
            placeholder="45000"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleAdd} disabled={addAssetMutation.isPending}>
        <Plus className="mr-2 h-4 w-4" />
        {addAssetMutation.isPending ? 'Adding...' : 'Add Asset'}
      </Button>
    </div>
  );
}
