import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Moon, Sun } from 'lucide-react';

function Settings() {
  const [theme, setTheme] = useState('light');
  const [showDashboardStats, setShowDashboardStats] = useState(true);
  const [showLowStockAlerts, setShowLowStockAlerts] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedStats = localStorage.getItem('showDashboardStats') !== 'false';
    const savedAlerts = localStorage.getItem('showLowStockAlerts') !== 'false';
    
    setTheme(savedTheme);
    setShowDashboardStats(savedStats);
    setShowLowStockAlerts(savedAlerts);
    
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast.success(`Tema ${newTheme === 'dark' ? 'karanlık' : 'açık'} moda geçildi`);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('showDashboardStats', showDashboardStats.toString());
    localStorage.setItem('showLowStockAlerts', showLowStockAlerts.toString());
    toast.success('Ayarlar kaydedildi');
  };

  return (
    <div className="space-y-6" data-testid="settings-page">
      <h1 className="text-4xl font-bold text-gray-800">Ayarlar</h1>

      <Card>
        <CardHeader>
          <CardTitle>Görünüm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <div>
                <Label>Karanlık Mod</Label>
                <p className="text-sm text-gray-500">Arayüzü koyu renge çevir</p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={handleThemeChange}
              data-testid="theme-toggle"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Özelleştirme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>İstatistikleri Göster</Label>
              <p className="text-sm text-gray-500">Ana sayfada satış ve stok istatistiklerini göster</p>
            </div>
            <Switch
              checked={showDashboardStats}
              onCheckedChange={setShowDashboardStats}
              data-testid="stats-toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Düşük Stok Uyarıları</Label>
              <p className="text-sm text-gray-500">Dashboard'da düşük stok uyarılarını göster</p>
            </div>
            <Switch
              checked={showLowStockAlerts}
              onCheckedChange={setShowLowStockAlerts}
              data-testid="alerts-toggle"
            />
          </div>

          <Button onClick={handleSaveSettings} className="w-full" data-testid="save-settings-btn">
            Ayarları Kaydet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uygulama Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sürüm:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Firma:</span>
              <span className="font-medium">Karaman Sağlık Medikal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">Emergent.sh</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;