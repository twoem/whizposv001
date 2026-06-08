import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OutletLayout } from '../../layouts/OutletLayout';
import { SHIFT_RECORDS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Plus, Lock } from 'lucide-react';

export const Shift: React.FC = () => {
  const [outletName] = useState(OUTLETS[0].name);
  const [isOpeningFloat, setIsOpeningFloat] = useState(false);
  const [floatAmount, setFloatAmount] = useState('');
  const currentShift = SHIFT_RECORDS[SHIFT_RECORDS.length - 1];

  const handleOpenShift = () => {
    console.log('Opening shift with float:', floatAmount);
    setFloatAmount('');
  };

  const handleCloseShift = () => {
    console.log('Closing shift');
  };

  return (
    <OutletLayout title={`Shift Management - ${outletName}`}>
      <div className="grid grid-cols-2 gap-8">
        {/* Current Shift */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Current Shift</h3>

          {currentShift.status === 'open' ? (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <Badge variant="success">Shift Open</Badge>
                <p className="text-slate-300 mt-2 text-sm">Started: {new Date(currentShift.openedAt).toLocaleTimeString()}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Opening Float:</span>
                  <span className="text-2xl font-bold text-teal-400">
                    {CURRENCY} {currentShift.openingFloat.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-300">Current Balance:</span>
                  <span className="text-2xl font-bold text-white">
                    {CURRENCY} {(currentShift.openingFloat + 5450).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCloseShift}
                size="lg"
                className="w-full"
                variant="danger"
              >
                <Lock size={20} className="mr-2" />
                Close Shift & Generate Z-Report
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <Badge variant="info">No Active Shift</Badge>
              </div>

              {!isOpeningFloat ? (
                <Button
                  onClick={() => setIsOpeningFloat(true)}
                  size="lg"
                  className="w-full flex items-center justify-center"
                >
                  <Plus size={20} className="mr-2" />
                  Open New Shift
                </Button>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Opening Float Amount"
                    placeholder="Enter opening float"
                    type="number"
                    value={floatAmount}
                    onChange={(e) => setFloatAmount(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsOpeningFloat(false)}
                      variant="ghost"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOpenShift}
                      className="flex-1"
                    >
                      Open Shift
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Shift History */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Shift History</h3>
          <div className="space-y-4">
            {SHIFT_RECORDS.map((shift) => (
              <div key={shift.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">{shift.cashier}</span>
                  <Badge variant={shift.status === 'open' ? 'success' : 'info'}>
                    {shift.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>Open: {new Date(shift.openedAt).toLocaleTimeString()}</p>
                  {shift.closedAt && (
                    <p>Closed: {new Date(shift.closedAt).toLocaleTimeString()}</p>
                  )}
                  <p className="text-teal-400 pt-2">
                    Opening: {CURRENCY} {shift.openingFloat.toLocaleString()}
                    {shift.closingBalance > 0 && ` → Closing: ${CURRENCY} ${shift.closingBalance.toLocaleString()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </OutletLayout>
  );
};
