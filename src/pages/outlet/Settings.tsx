import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OutletLayout } from '../../layouts/OutletLayout';
import { Badge } from '../../components/ui/Badge';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';

export const Settings: React.FC = () => {
  const [printSettings, setPrintSettings] = useState({
    defaultPrinter: 'Thermal Printer 1',
    printMode: 'receipt',
    autoPrint: true,
    duplicateCopies: '1',
    receiptHeader: 'Welcome to Whizpoint',
    receiptFooter: 'Thank you for your purchase!',
  });

  const [cashierSettings, setCashierSettings] = useState({
    cashierName: 'Cashier 1',
    registerNumber: 'REG-001',
    dailyStartingFloat: '5000',
    autoLogout: true,
    logoutAfterMinutes: '30',
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    showProductImages: true,
    showPrice: true,
    currencySymbol: 'KSH',
  });

  const [offlineSettings, setOfflineSettings] = useState({
    offlineMode: false,
    autoSync: true,
    syncOnlineOnly: false,
    retryFailed: true,
  });

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings`);
  };

  const handleReset = (section: string) => {
    console.log(`Resetting ${section} settings`);
  };

  return (
    <OutletLayout title="POS Settings">
      <div className="space-y-8">
        {/* Print Settings */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Receipt Print Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Input
              label="Default Printer"
              value={printSettings.defaultPrinter}
              onChange={(e) => setPrintSettings({ ...printSettings, defaultPrinter: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Print Mode</label>
              <select
                value={printSettings.printMode}
                onChange={(e) => setPrintSettings({ ...printSettings, printMode: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="receipt">Receipt (58mm Thermal)</option>
                <option value="bill">Bill (A4)</option>
                <option value="invoice">Invoice (A4)</option>
              </select>
            </div>
            <Input
              label="Duplicate Copies"
              type="number"
              value={printSettings.duplicateCopies}
              onChange={(e) => setPrintSettings({ ...printSettings, duplicateCopies: e.target.value })}
            />
            <div className="col-span-2">
              <Input
                label="Receipt Header Text"
                value={printSettings.receiptHeader}
                onChange={(e) => setPrintSettings({ ...printSettings, receiptHeader: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Receipt Footer Text"
                value={printSettings.receiptFooter}
                onChange={(e) => setPrintSettings({ ...printSettings, receiptFooter: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={printSettings.autoPrint}
                  onChange={(e) => setPrintSettings({ ...printSettings, autoPrint: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Auto-print receipt on transaction completion</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleSave('print')} className="flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => handleReset('print')} variant="secondary">
              <RotateCcw size={18} />
            </Button>
          </div>
        </Card>

        {/* Cashier Settings */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Cashier Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Input
              label="Cashier Name"
              value={cashierSettings.cashierName}
              onChange={(e) => setCashierSettings({ ...cashierSettings, cashierName: e.target.value })}
            />
            <Input
              label="Register Number"
              value={cashierSettings.registerNumber}
              onChange={(e) => setCashierSettings({ ...cashierSettings, registerNumber: e.target.value })}
            />
            <Input
              label="Daily Starting Float (KSH)"
              type="number"
              value={cashierSettings.dailyStartingFloat}
              onChange={(e) => setCashierSettings({ ...cashierSettings, dailyStartingFloat: e.target.value })}
            />
            <Input
              label="Auto-logout After (minutes)"
              type="number"
              value={cashierSettings.logoutAfterMinutes}
              onChange={(e) => setCashierSettings({ ...cashierSettings, logoutAfterMinutes: e.target.value })}
            />
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cashierSettings.autoLogout}
                  onChange={(e) => setCashierSettings({ ...cashierSettings, autoLogout: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Enable auto-logout for inactive sessions</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleSave('cashier')} className="flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => handleReset('cashier')} variant="secondary">
              <RotateCcw size={18} />
            </Button>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Display Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <select
                value={displaySettings.fontSize}
                onChange={(e) => setDisplaySettings({ ...displaySettings, fontSize: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={displaySettings.currencySymbol}
                onChange={(e) => setDisplaySettings({ ...displaySettings, currencySymbol: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="KSH">KSH (Kenyan Shilling)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showProductImages}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, showProductImages: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Show product images on POS</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displaySettings.showPrice}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, showPrice: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Show product prices</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleSave('display')} className="flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => handleReset('display')} variant="secondary">
              <RotateCcw size={18} />
            </Button>
          </div>
        </Card>

        {/* Offline & Sync Settings */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Offline & Sync Settings</h3>
            <Badge variant="info">Experimental</Badge>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineSettings.offlineMode}
                  onChange={(e) => setOfflineSettings({ ...offlineSettings, offlineMode: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Enable offline mode (process transactions without connection)</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineSettings.autoSync}
                  onChange={(e) => setOfflineSettings({ ...offlineSettings, autoSync: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Auto-sync queued transactions when online</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineSettings.syncOnlineOnly}
                  onChange={(e) => setOfflineSettings({ ...offlineSettings, syncOnlineOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Only sync on WiFi network (not mobile data)</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offlineSettings.retryFailed}
                  onChange={(e) => setOfflineSettings({ ...offlineSettings, retryFailed: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Retry failed sync attempts automatically</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleSave('offline')} className="flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => handleReset('offline')} variant="secondary">
              <RotateCcw size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </OutletLayout>
  );
};
