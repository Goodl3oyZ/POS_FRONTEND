import { api } from "./config";

/** ===== Types ===== */
export interface MenuItemStatistic {
  menu_item_id: string;
  menu_item_name: string;
  sku: string;
  category_id: string;
  category_name: string;
  current_price_baht: number;
  quantity_sold: number;
  total_revenue_baht: number;
  average_price_baht: number;
  first_sold_at: string;
  last_sold_at: string;
  times_ordered: number;
}

export interface StatisticsSummary {
  total_items_tracked: number;
  total_quantity_sold: number;
  total_revenue_baht: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface MenuStatisticsResponse {
  statistics: MenuItemStatistic[];
  summary: StatisticsSummary;
}

export interface MenuStatisticsParams {
  start_date?: string; // ISO 8601 format
  end_date?: string; // ISO 8601 format
  category_id?: string; // UUID
  sort_by?: "quantity_sold" | "revenue" | "name";
  order?: "asc" | "desc";
  limit?: number;
}

export interface TopSellingItem {
  rank: number;
  menu_item_id: string;
  menu_item_name: string;
  category_name: string;
  quantity_sold: number;
  revenue_baht: number;
  percentage_of_total: number;
}

export interface TopSellingItemsResponse {
  top_items: TopSellingItem[];
  period: {
    start: string;
    end: string;
  };
}

export interface TopSellingItemsParams {
  limit?: number;
  start_date?: string; // ISO 8601 format
  end_date?: string; // ISO 8601 format
  metric?: "quantity" | "revenue";
}

export interface LowSellingItem {
  menu_item_id: string;
  menu_item_name: string;
  category_name: string;
  quantity_sold: number;
  revenue_baht: number;
  days_since_last_sale: number;
  is_active: boolean;
}

export interface NoSalesItem {
  menu_item_id: string;
  menu_item_name: string;
  category_name: string;
  is_active: boolean;
  created_at: string;
}

export interface LowSellingItemsResponse {
  low_selling_items: LowSellingItem[];
  no_sales_items: NoSalesItem[];
  period: {
    start: string;
    end: string;
  };
}

export interface LowSellingItemsParams {
  threshold?: number; // Default: 5
  start_date?: string; // ISO 8601 format
  end_date?: string; // ISO 8601 format
}

/** ===== API Functions ===== */

/**
 * Get all menu items statistics with optional filters
 * @param params - Query parameters for filtering and sorting
 * @returns Promise containing statistics and summary
 */
export async function getMenuItemsStatistics(
  params?: MenuStatisticsParams
): Promise<MenuStatisticsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.start_date) queryParams.append("start_date", params.start_date);
  if (params?.end_date) queryParams.append("end_date", params.end_date);
  if (params?.category_id)
    queryParams.append("category_id", params.category_id);
  if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
  if (params?.order) queryParams.append("order", params.order);
  if (params?.limit) queryParams.append("limit", String(params.limit));

  const url = `/v1/menu-items/statistics${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const res = await api.get(url);
  return res.data;
}

/**
 * Get top selling items report
 * @param params - Query parameters for filtering
 * @returns Promise containing top selling items and period
 */
export async function getTopSellingItems(
  params?: TopSellingItemsParams
): Promise<TopSellingItemsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.limit) queryParams.append("limit", String(params.limit));
  if (params?.start_date) queryParams.append("start_date", params.start_date);
  if (params?.end_date) queryParams.append("end_date", params.end_date);
  if (params?.metric) queryParams.append("metric", params.metric);

  const url = `/v1/reports/top-selling-items${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const res = await api.get(url);
  return res.data;
}

/**
 * Get low/no sales items report
 * @param params - Query parameters for filtering
 * @returns Promise containing low selling and no sales items
 */
export async function getLowSellingItems(
  params?: LowSellingItemsParams
): Promise<LowSellingItemsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.threshold)
    queryParams.append("threshold", String(params.threshold));
  if (params?.start_date) queryParams.append("start_date", params.start_date);
  if (params?.end_date) queryParams.append("end_date", params.end_date);

  const url = `/v1/reports/low-selling-items${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const res = await api.get(url);
  return res.data;
}
