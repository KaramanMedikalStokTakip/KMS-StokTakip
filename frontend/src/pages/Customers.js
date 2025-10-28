import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Eye } from 'lucide-react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [purchasesDialogOpen, setPurchasesDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API}/customers`);
      setCustomers(response.data);
    } catch (error) {
      toast.error('Müşteriler yüklenemedi');
    }
  };

  const fetchCustomerPurchases = async (customerId) => {
    try {
      const response = await axios.get(`${API}/customers/${customerId}/purchases`);
      setPurchases(response.data);
    } catch (error) {
      toast.error('Satın almalar yüklenemedi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/customers`, formData);
      toast.success('Müşteri eklendi');
      fetchCustomers();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const viewPurchases = async (customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerPurchases(customer.id);
    setPurchasesDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', address: '', notes: '' });
  };

  return (
    <div className="space-y-6" data-testid="customers-page">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Müşteri Yönetimi</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-customer-btn">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Müşteri
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Müşteri Ekle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Ad Soyad *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="customer-name-input"
                />
              </div>
              <div>
                <Label>Telefon *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  data-testid="customer-phone-input"
                />
              </div>
              <div>
                <Label>E-posta</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="customer-email-input"
                />
              </div>
              <div>
                <Label>Adres</Label>
                <textarea
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  data-testid="customer-address-input"
                />
              </div>
              <div>
                <Label>Notlar</Label>
                <textarea
                  className="w-full border rounded-md px-3 py-2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  data-testid="customer-notes-input"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="submit-customer-btn">Ekle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="card-hover" data-testid={`customer-card-${customer.id}`}>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{customer.name}</h3>
              <p className="text-sm text-gray-600 mb-1">📞 {customer.phone}</p>
              {customer.email && <p className="text-sm text-gray-600 mb-1">✉️ {customer.email}</p>}
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-gray-600">Toplam Harcama</p>
                <p className="text-2xl font-bold text-blue-600">₺{customer.total_spent?.toFixed(2) || '0.00'}</p>
              </div>
              {customer.notes && (
                <p className="text-sm text-gray-500 mt-3 italic">"{customer.notes}"</p>
              )}
              <Button
                className="w-full mt-4"
                variant="outline"
                onClick={() => viewPurchases(customer)}
                data-testid={`view-purchases-${customer.id}`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Satın Almalar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={purchasesDialogOpen} onOpenChange={setPurchasesDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name} - Satın Alma Geçmişi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {purchases.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Henüz satın alma yok</p>
            ) : (
              purchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-500">{new Date(purchase.created_at).toLocaleDateString('tr-TR')}</p>
                        <p className="text-sm text-gray-600">Ödeme: {purchase.payment_method === 'nakit' ? 'Nakit' : 'Kredi Kartı'}</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">₺{purchase.final_amount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      {purchase.items.map((item, idx) => (
                        <div key={idx} className="text-sm flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>₺{item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Customers;