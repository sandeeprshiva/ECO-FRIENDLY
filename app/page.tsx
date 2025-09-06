"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "../src/contexts/AuthContext"
import { useItems } from "../src/hooks/useItems"
import { useCommunityAnalytics } from "../src/hooks/useAnalytics"
import ItemCard from "../src/components/items/ItemCard"
import LoginForm from "../src/components/auth/LoginForm"
import RegisterForm from "../src/components/auth/RegisterForm"
import {
  Search,
  Filter,
  Leaf,
  Plus,
  Star,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Heart,
  Eye,
  Loader2,
  RefreshCw
} from "lucide-react"

export default function HomePage() {
  const { user, isAuthenticated, login, register } = useAuth()
  const { items, loading, error, searchItems, updateFilters, filters, hasMore, loadMore } = useItems()
  const { analytics: communityAnalytics, loading: analyticsLoading } = useCommunityAnalytics()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      await searchItems(searchQuery.trim())
    }
  }

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value })
  }

  const handleAuthSuccess = (data) => {
    setShowAuth(false)
    // Redirect or show success message
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">EcoFriend</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Award className="h-3 w-3 mr-1" />
                    {user?.greenScore || 100} pts
                  </Badge>
                  <Button variant="outline" size="sm">
                    Profile
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuth(true)}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Buy, Sell, Donate - Make Every Item Count
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join the sustainable marketplace where every transaction helps the planet
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-gray-900"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      {communityAnalytics && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {communityAnalytics.totalUsers || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {communityAnalytics.totalItems || 0}
                  </div>
                  <div className="text-sm text-gray-600">Items Listed</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {communityAnalytics.totalCO2Saved || 0}kg
                  </div>
                  <div className="text-sm text-gray-600">CO₂ Saved</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {communityAnalytics.totalTransactions || 0}
                  </div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Featured Items</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            {isAuthenticated && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Item
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.transactionType || ""}
                  onValueChange={(value) => handleFilterChange('transactionType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="donate">Donate</SelectItem>
                    <SelectItem value="swap">Swap</SelectItem>
                    <SelectItem value="borrow">Borrow</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.condition || ""}
                  onValueChange={(value) => handleFilterChange('condition', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Conditions</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Max Price (₹)"
                  type="number"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            {isAuthenticated && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Your First Item
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFavorite={(id) => console.log('Favorite:', id)}
                  onContact={(item) => console.log('Contact:', item)}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {authMode === 'login' ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
            <div className="p-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowAuth(false)}
                className="text-gray-500"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
