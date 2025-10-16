"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getMenuItemsStatistics,
  getTopSellingItems,
  getLowSellingItems,
  MenuItemStatistic,
  StatisticsSummary,
  TopSellingItem,
  LowSellingItem,
  NoSalesItem,
} from "@/lib/api/menu-statistics";
import { getAllCategories } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  RefreshCw,
  Filter,
  TrendingUp,
  Award,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function MenuStatistics() {
  const [statistics, setStatistics] = useState<MenuItemStatistic[]>([]);
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [topItems, setTopItems] = useState<TopSellingItem[]>([]);
  const [topItemsPeriod, setTopItemsPeriod] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [lowSellingItems, setLowSellingItems] = useState<LowSellingItem[]>([]);
  const [noSalesItems, setNoSalesItems] = useState<NoSalesItem[]>([]);
  const [lowItemsPeriod, setLowItemsPeriod] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTopItems, setLoadingTopItems] = useState(false);
  const [loadingLowItems, setLoadingLowItems] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<"quantity_sold" | "revenue" | "name">(
    "quantity_sold"
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchStatistics();
    fetchTopSellingItems();
    fetchLowSellingItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort_by: sortBy,
        order: order,
      };

      if (startDate) params.start_date = new Date(startDate).toISOString();
      if (endDate) params.end_date = new Date(endDate).toISOString();
      if (selectedCategory) params.category_id = selectedCategory;
      if (limit) params.limit = parseInt(limit);

      const response = await getMenuItemsStatistics(params);
      setStatistics(response.statistics);
      setSummary(response.summary);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSellingItems = async () => {
    setLoadingTopItems(true);
    try {
      const params: any = {
        limit: 10,
        metric: "quantity",
      };

      if (startDate) params.start_date = new Date(startDate).toISOString();
      if (endDate) params.end_date = new Date(endDate).toISOString();

      const response = await getTopSellingItems(params);
      setTopItems(response.top_items);
      setTopItemsPeriod(response.period);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load top selling items"
      );
    } finally {
      setLoadingTopItems(false);
    }
  };

  const fetchLowSellingItems = async () => {
    setLoadingLowItems(true);
    try {
      const params: any = {
        threshold: 5,
      };

      if (startDate) params.start_date = new Date(startDate).toISOString();
      if (endDate) params.end_date = new Date(endDate).toISOString();

      const response = await getLowSellingItems(params);
      setLowSellingItems(response.low_selling_items);
      setNoSalesItems(response.no_sales_items);
      setLowItemsPeriod(response.period);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load low selling items"
      );
    } finally {
      setLoadingLowItems(false);
    }
  };

  const handleApplyFilters = () => {
    fetchStatistics();
    fetchTopSellingItems();
    fetchLowSellingItems();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    setSortBy("quantity_sold");
    setOrder("desc");
    setLimit("");
    setTimeout(() => {
      fetchStatistics();
      fetchTopSellingItems();
      fetchLowSellingItems();
    }, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold">Menu Item Statistics</h2>
        <p className="text-gray-600 mt-1">
          Track sales performance and revenue by menu item
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Items Tracked</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.total_items_tracked}
            </p>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Quantity Sold</p>
            <p className="text-2xl font-bold text-blue-600">
              {summary.total_quantity_sold.toLocaleString()}
            </p>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.total_revenue_baht)}
            </p>
          </div>
        </div>
      )}

      {/* Top Selling Items */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-orange-600" />
          <h3 className="text-lg font-semibold">Top 10 Selling Items</h3>
          {topItemsPeriod && (
            <span className="text-xs text-gray-500 ml-auto">
              {formatDate(topItemsPeriod.start)} -{" "}
              {formatDate(topItemsPeriod.end)}
            </span>
          )}
        </div>

        {loadingTopItems ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topItems.map((item) => (
              <div
                key={item.menu_item_id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Rank Badge */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    item.rank === 1
                      ? "bg-yellow-500"
                      : item.rank === 2
                      ? "bg-gray-400"
                      : item.rank === 3
                      ? "bg-orange-600"
                      : "bg-blue-500"
                  }`}
                >
                  {item.rank === 1 && <Award size={20} />}
                  {item.rank !== 1 && `#${item.rank}`}
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.menu_item_name}
                  </p>
                  <p className="text-xs text-gray-500">{item.category_name}</p>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {item.quantity_sold.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatCurrency(item.revenue_baht)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.percentage_of_total.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingTopItems && topItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No top selling items data available</p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Limit */}
          <div className="space-y-2">
            <Label htmlFor="limit">Limit Results</Label>
            <Input
              id="limit"
              type="number"
              min="1"
              placeholder="All"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sort_by">Sort By</Label>
            <select
              id="sort_by"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "quantity_sold" | "revenue" | "name"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="quantity_sold">Quantity Sold</option>
              <option value="revenue">Revenue</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <select
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button onClick={handleApplyFilters} className="gap-2">
            <RefreshCw size={16} />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Low/No Sales Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Selling Items */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={20} className="text-orange-600" />
            <h3 className="text-lg font-semibold">Low Selling Items</h3>
            <span className="text-xs text-gray-500 ml-auto">{"<"} 5 sales</span>
          </div>

          {loadingLowItems ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : lowSellingItems.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {lowSellingItems.map((item) => (
                <div
                  key={item.menu_item_id}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.menu_item_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.category_name}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-600">
                        Sold: {item.quantity_sold}
                      </span>
                      <span className="text-xs text-gray-600">
                        {formatCurrency(item.revenue_baht)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        item.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                    <p className="text-xs text-orange-600 mt-1">
                      {item.days_since_last_sale} days ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No low selling items</p>
            </div>
          )}
        </div>

        {/* No Sales Items */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-600" />
            <h3 className="text-lg font-semibold">No Sales Items</h3>
            <span className="text-xs text-gray-500 ml-auto">Never ordered</span>
          </div>

          {loadingLowItems ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : noSalesItems.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {noSalesItems.map((item) => (
                <div
                  key={item.menu_item_id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.menu_item_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.category_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {formatDate(item.created_at)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        item.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">All items have sales!</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Rank
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Menu Item
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  SKU
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">
                  Qty Sold
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">
                  Times Ordered
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  First Sold
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Last Sold
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statistics.map((item, index) => (
                <tr key={item.menu_item_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.menu_item_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Current: {formatCurrency(item.current_price_baht)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.sku}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.category_name}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-blue-600">
                    {item.quantity_sold.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {item.times_ordered.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    {formatCurrency(item.total_revenue_baht)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    {formatCurrency(item.average_price_baht)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    {formatDate(item.first_sold_at)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    {formatDate(item.last_sold_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {statistics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No statistics available</p>
          </div>
        )}
      </div>
    </div>
  );
}
