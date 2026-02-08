import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { FreeAsset } from '@/lib/freePortfolioAnalysis';

const TIME_HORIZONS = ['Trader', '6 months', '2 years'];
const MAX_FREE_ASSETS = 3;

interface FreeAssetEditorProps {
  assets: FreeAsset[];
  onAssetsChange: (assets: FreeAsset[]) => void;
}

export default function FreeAssetEditor({ assets, onAssetsChange }: FreeAssetEditorProps) {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [allocation, setAllocation] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('6 months');
  const [entryPrice, setEntryPrice] = useState('');

  const handleAdd = () => {
    if (assets.length >= MAX_FREE_ASSETS) {
      toast.error(`Free users can add up to ${MAX_FREE_ASSETS} assets. Upgrade to Pro for unlimited assets.`);
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

    const newAsset: FreeAsset = {
      id: Date.now(),
      name,
      ticker: ticker.toUpperCase(),
      allocation: allocationNum,
      timeHorizon,
      averageEntryPrice: entryPrice ? parseFloat(entryPrice) : undefined,
    };

    onAssetsChange([...assets, newAsset]);
    toast.success('Asset added');
    
    // Reset form
    setName('');
    setTicker('');
    setAllocation('');
    setEntryPrice('');
  };

  const handleRemove = (id: number) => {
    onAssetsChange(assets.filter(a => a.id !== id));
    toast.success('Asset removed');
  };

  return (
    <div className="space-y-6">
      {/* Current Assets */}
      {assets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Assets ({assets.length}/{MAX_FREE_ASSETS})</CardTitle>
            <CardDescription>Free users can add up to {MAX_FREE_ASSETS} assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-muted-foreground">{asset.ticker}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{asset.allocation}%</p>
                      <p className="text-xs text-muted-foreground">{asset.timeHorizon}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(asset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Asset Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Asset</CardTitle>
          <CardDescription>
            {assets.length >= MAX_FREE_ASSETS 
              ? 'Maximum assets reached. Upgrade to Pro for unlimited assets.'
              : `Add up to ${MAX_FREE_ASSETS - assets.length} more asset${MAX_FREE_ASSETS - assets.length !== 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  placeholder="Bitcoin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={assets.length >= MAX_FREE_ASSETS}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker *</Label>
                <Input
                  id="ticker"
                  placeholder="BTC"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  disabled={assets.length >= MAX_FREE_ASSETS}
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
                  disabled={assets.length >= MAX_FREE_ASSETS}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horizon">Time Horizon</Label>
                <Select 
                  value={timeHorizon} 
                  onValueChange={setTimeHorizon}
                  disabled={assets.length >= MAX_FREE_ASSETS}
                >
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
                  disabled={assets.length >= MAX_FREE_ASSETS}
                />
              </div>
            </div>

            <Button 
              onClick={handleAdd} 
              disabled={assets.length >= MAX_FREE_ASSETS}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
