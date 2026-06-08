import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';

export const Settings: React.FC = () => {
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'Whizpoint Solutions',
    businessPhone: '+254 712 345 678',
    businessEmail: 'info@whizpoint.com',
    businessAddress: 'Nairobi, Kenya',
    taxRate: '16',
  });

  const [printSettings, setPrintSettings] = useState({
    defaultPrinter: 'Thermal Printer 1',
    printMode: 'receipt',
    autoPrint: true,
    duplicateCopies: '1',
    paperSize: 'A4',
  });

  const [emailSettings, setEmailSettings] = useState({
    emailNotifications: true,
    dailyReports: true,
    lowStockAlerts: true,
    recipientEmail: 'manager@whizpoint.com',
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: '••••••••••••••••',
    webhookUrl: 'https://api.whizpoint.com/webhooks',
    syncInterval: '15',
  });

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings`);
  };

  const handleReset = (section: string) => {
    console.log(`Resetting ${section} settings`);
  };

  return (
    <ServerLayout title="Settings">
      <div className="space-y-8">
        {/* Business Information */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Business Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Input
              label="Business Name"
              value={businessSettings.businessName}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
            />
            <Input
              label="Business Phone"
              value={businessSettings.businessPhone}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessPhone: e.target.value })}
            />
            <Input
              label="Business Email"
              type="email"
              value={businessSettings.businessEmail}
              onChange={(e) => setBusinessSettings({ ...businessSettings, businessEmail: e.target.value })}
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={businessSettings.taxRate}
              onChange={(e) => setBusinessSettings({ ...businessSettings, taxRate: e.target.value })}
            />
            <div className="col-span-2">
              <Input
                label="Business Address"
                value={businessSettings.businessAddress}
                onChange={(e) => setBusinessSettings({ ...businessSettings, businessAddress: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleSave('business')} className="flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => handleReset('business')} variant="secondary">
              <RotateCcw size={18} />
            </Button>
          </div>
        </Card>

        {/* Print Settings */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Print Settings</h3>
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
                <option value="receipt">Receipt (58mm)</option>
                <option value="bill">Bill (A4)</option>
                <option value="both">Both</option>
              </select>
            </div>
            <Input
              label="Paper Size"
              value={printSettings.paperSize}
              onChange={(e) => setPrintSettings({ ...printSettings, paperSize: e.target.value })}
            />
            <Input
              label="Duplicate Copies"
              type="number"
              value={printSettings.duplicateCopies}
              onChange={(e) => setPrintSettings({ ...printSettings, duplicateCopies: e.target.value })}
            />
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={printSettings.autoPrint}
                  onChange={(e) => setPrintSettings({ ...printSettings, autoPrint: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">Auto-print receipts on transaction completion</span>
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

        {/* Email Notifications */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Email Notifications</h3>
          </div>
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailSettings.emailNotifications}
                onChange={(e) => setEmailSettings({ ...emailSettings, emailNotifications: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-gray-700 font-medium">Enable email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailSettings.dailyReports}
                onChange={(e) => setEmailSettings({ ...emailSettings, dailyReports: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-gray-700 font-medium">Send daily sales reports</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailSettings.lowStockAlerts}
                onChange={(e) => setEmailSettings({ ...emailSettings, lowStockAlerts: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-gray-700 font-medium">Alert on low stock items</span>
            </label>
            <Input
              label="Notification Email"
              type="email"
              value={emailSettings.recipientEmail}
              onChange={(e) => setEmailSettings({ ...emailSettings, recipientEmail: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleSave('email')} className="flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => handleReset('email')} variant="secondary">
              <RotateCcw size={18} />
            </Button>
          </div>
        </Card>

        {/* API Settings */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon size={24} className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">API & Integrations</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="col-span-2">
              <Input
                label="API Key"
                type="password"
                value={apiSettings.apiKey}
                onChange={(e) => setApiSettings({ ...apiSettings, apiKey: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Webhook URL"
                value={apiSettings.webhookUrl}
                onChange={(e) => setApiSettings({ ...apiSettings, webhookUrl: e.target.value })}
              />
            </div>
            <Input
              label="Sync Interval (minutes)"
              type="number"
              value={apiSettings.syncInterval}
              onChange={(e) => setApiSettings({ ...apiSettings, syncInterval: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleSave('api')} className="flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button onClick={() => handleReset('api')} variant="secondary">
              <RotateCcw size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </ServerLayout>
  );
};
