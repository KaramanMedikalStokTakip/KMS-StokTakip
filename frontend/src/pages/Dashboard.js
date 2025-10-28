import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingDown, DollarSign, ShoppingCart, AlertCircle } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, lowStockRes] = await Promise.all([
        axios.get(`${API}/reports/dashboard`),
        axios.get(`${API}/products/low-stock`)
      ]);
      setStats(statsRes.data);
      setLowStock(lowStockRes.data);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card" data-testid="total-products-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Toplam Ürün</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats?.total_products || 0}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card" data-testid="low-stock-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Düşük Stok</p>
                <h3 className="text-3xl font-bold text-orange-600">{stats?.low_stock_count || 0}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card" data-testid="today-sales-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bugünkü Satış</p>
                <h3 className="text-3xl font-bold text-green-600">₺{stats?.today_revenue?.toFixed(2) || '0.00'}</h3>
                <p className="text-xs text-gray-400">{stats?.today_sales_count || 0} adet</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card" data-testid="week-sales-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Haftalık Satış</p>
                <h3 className="text-3xl font-bold text-purple-600">₺{stats?.week_revenue?.toFixed(2) || '0.00'}</h3>
                <p className="text-xs text-gray-400">{stats?.week_sales_count || 0} adet</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="border-orange-200 bg-orange-50" data-testid="low-stock-alert">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              Düşük Stok Uyarısı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.slice(0, 5).map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.brand} - {product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">Stok: {product.quantity}</p>
                    <p className="text-xs text-gray-500">Min: {product.min_quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts would go here - keeping it simple for MVP */}
    </div>
  );
}

export default Dashboard;