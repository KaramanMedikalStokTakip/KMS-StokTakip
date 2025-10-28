import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { useAuth } from '../App';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Moon, Sun, Plus, Trash2 } from 'lucide-react';

function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');
  const [showDashboardStats, setShowDashboardStats] = useState(true);
  const [showLowStockAlerts, setShowLowStockAlerts] = useState(true);
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'depo'
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedStats = localStorage.getItem('showDashboardStats') !== 'false';
    const savedAlerts = localStorage.getItem('showLowStockAlerts') !== 'false';
    
    setTheme(savedTheme);
    setShowDashboardStats(savedStats);
    setShowLowStockAlerts(savedAlerts);
    
    applyTheme(savedTheme);
    
    if (user?.role === 'yönetici') {
      fetchUsers();
    }
  }, [user]);

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fafafa';
      document.body.style.color = '#000000';
    }
  };

  const fetchUsers = async () => {
    try {
      // Mock için şimdilik - gerçek API'ye bağlanabilir
      setUsers([
        { id: user.id, username: user.username, email: user.email, role: user.role }
      ]);
    } catch (error) {
      console.error('Users fetch error:', error);
    }
  };

  const handleThemeChange = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    toast.success(`Tema ${newTheme === 'dark' ? 'karanlık' : 'açık'} moda geçildi`);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('showDashboardStats', showDashboardStats.toString());
    localStorage.setItem('showLowStockAlerts', showLowStockAlerts.toString());
    toast.success('Ayarlar kaydedildi');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/register`, newUser);
      toast.success('Kullanıcı başarıyla eklendi');
      fetchUsers();
      setDialogOpen(false);
      setNewUser({ username: '', email: '', password: '', role: 'depo' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Kullanıcı eklenemedi');
    }
  };

  return (
    <div className="space-y-6" data-testid="settings-page">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Ayarlar</h1>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Görünüm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <div>
                <Label className="dark:text-white">Karanlık Mod</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Arayüzü koyu renge çevir</p>
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

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Dashboard Özelleştirme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="dark:text-white">İstatistikleri Göster</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ana sayfada satış ve stok istatistiklerini göster</p>
            </div>
            <Switch
              checked={showDashboardStats}
              onCheckedChange={setShowDashboardStats}
              data-testid="stats-toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="dark:text-white">Düşük Stok Uyarıları</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard'da düşük stok uyarılarını göster</p>
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

      {user?.role === 'yönetici' && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="dark:text-white">Kullanıcı Yönetimi</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="add-user-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Kullanıcı Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <Label>Kullanıcı Adı *</Label>
                    <Input
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      required
                      data-testid="new-username-input"
                    />
                  </div>
                  <div>
                    <Label>E-posta *</Label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                      data-testid="new-email-input"
                    />
                  </div>
                  <div>
                    <Label>Şifre *</Label>
                    <Input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                      data-testid="new-password-input"
                    />
                  </div>
                  <div>
                    <Label>Rol *</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      data-testid="new-role-select"
                    >
                      <option value="yönetici">Yönetici</option>
                      <option value="depo">Depo</option>
                      <option value="satış">Satış</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" data-testid="submit-user-btn">
                    Kullanıcı Ekle
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{u.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{u.email} - {u.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Uygulama Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sürüm:</span>
              <span className="font-medium dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Firma:</span>
              <span className="font-medium dark:text-white">Karaman Sağlık Medikal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Platform:</span>
              <span className="font-medium dark:text-white">Emergent.sh</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;