export type GarmentType = 'shirt' | 'pant' | 'kurta' | 'suit' | 'sherwani' | 'other'

export type OrderStatus =
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'delivered'
  | 'cancelled'

export type TailorSpecialty = 'shirt' | 'pant' | 'kurta' | 'suit' | 'sherwani'

export interface Tailor {
  id: string
  name: string
  phone: string
  shop_name: string | null
  address: string
  lat: number | null
  lng: number | null
  specialties: TailorSpecialty[]
  base_price_shirt: number
  base_price_pant: number
  rating: number
  total_orders: number
  is_active: boolean
  subscription_status: 'active' | 'pending' | 'cancelled'
  photos: string[]
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string | null
  garment_type: GarmentType
  fabric_description: string | null
  fabric_provided: boolean
  price: number
  commission: number
  tailor_id: string | null
  tailor?: Tailor
  status: OrderStatus
  measurement_notes: string | null
  delivery_date: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  order_id: string
  customer_phone: string
  rating: number
  comment: string | null
  created_at: string
}

export interface DashboardStats {
  total_orders_today: number
  total_orders_month: number
  active_tailors: number
  pending_orders: number
  completed_orders: number
  revenue_month: number
  revenue_today: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
