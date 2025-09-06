"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  Leaf,
  ShoppingCart,
  RefreshCw,
  BookOpen,
  Plus,
  Star,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Upload,
  X,
  Camera,
  Droplets,
  TreePine,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Shield,
  Truck,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  Package,
  History,
  Trophy,
  Target,
  BarChart3,
  Download,
  Medal,
  CheckCircle,
  Globe,
  Zap,
  QrCode,
  CreditCard,
} from "lucide-react"

export default function EcoFriendMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSellForm, setShowSellForm] = useState(false)
  const [saleType, setSaleType] = useState("normal")
  const [formProgress, setFormProgress] = useState(20)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const [showCommunity, setShowCommunity] = useState(false)
  const [showNGOShowcase, setShowNGOShowcase] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [donationAmount, setDonationAmount] = useState(500)
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedPriceRange, setSelectedPriceRange] = useState("")
  const [selectedDistance, setSelectedDistance] = useState("")
  const [selectedLocalArea, setSelectedLocalArea] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi")
  const [selectedBank, setSelectedBank] = useState("")
  const [donationQuickAmount, setDonationQuickAmount] = useState(0)

  const userProfile = {
    name: "Alex Johnson",
    avatar: "AJ",
    greenScore: 1250,
    ecoLevel: "Eco Champion",
    joinDate: "March 2023",
    totalImpact: {
      co2Saved: 450,
      waterSaved: 2800,
      itemsSaved: 28,
      treesEquivalent: 12,
    },
    monthlyData: [
      { month: "Jan", co2: 45, water: 280 },
      { month: "Feb", co2: 52, water: 320 },
      { month: "Mar", co2: 38, water: 240 },
      { month: "Apr", co2: 65, water: 410 },
      { month: "May", co2: 58, water: 380 },
      { month: "Jun", co2: 72, water: 450 },
    ],
    achievements: [
      { id: 1, name: "First Sale", description: "Sold your first item", icon: "🎉", earned: true },
      { id: 2, name: "Eco Warrior", description: "Saved 100kg CO₂", icon: "🌱", earned: true },
      { id: 3, name: "Community Helper", description: "Helped 10 people", icon: "🤝", earned: true },
      { id: 4, name: "Water Saver", description: "Saved 1000L water", icon: "💧", earned: true },
      { id: 5, name: "Tree Hugger", description: "Equivalent to planting 10 trees", icon: "🌳", earned: true },
      { id: 6, name: "Marketplace Master", description: "Complete 50 transactions", icon: "👑", earned: false },
    ],
    listings: [
      { id: 1, title: "Vintage Camera", price: 85, status: "Active", views: 24, likes: 8 },
      { id: 2, title: "Designer Shoes", price: 120, status: "Sold", views: 45, likes: 12 },
      { id: 3, title: "Coffee Machine", price: 65, status: "Active", views: 18, likes: 5 },
    ],
    purchases: [
      { id: 1, title: "Leather Jacket", price: 45, date: "2024-01-15", seller: "Sarah M." },
      { id: 2, title: "iPhone 12 Pro", price: 450, date: "2024-01-10", seller: "Tech Store" },
      { id: 3, title: "Yoga Mat Set", price: 25, date: "2024-01-05", seller: "Wellness Co." },
    ],
  }

  const categories = [
    { id: "all", name: "All Items" },
    { id: "clothing", name: "Clothing" },
    { id: "electronics", name: "Electronics" },
    { id: "home", name: "Home & Garden" },
    { id: "books", name: "Books" },
    { id: "furniture", name: "Furniture" },
  ]

  const products = [
    {
      id: 1,
      title: "Vintage Leather Jacket",
      price: 3499,
      originalPrice: 8999,
      image: "/vintage-leather-jacket.png",
      images: ["/vintage-leather-jacket.png", "/vintage-leather-jacket.png", "/vintage-leather-jacket.png"],
      co2Saved: 25,
      waterSaved: 150,
      condition: "Excellent",
      location: "Bengaluru",
      rating: 4.8,
      seller: "Priya S.",
      sellerScore: 920,
      description:
        "Beautiful vintage leather jacket in excellent condition. Barely worn, perfect for fall and winter. Made from genuine leather with a classic design that never goes out of style.",
      isDonation: false,
      reviews: [
        { user: "Rahul K.", rating: 5, comment: "Amazing quality! Exactly as described." },
        { user: "Sneha M.", rating: 4, comment: "Great jacket, fast shipping." },
      ],
    },
    {
      id: 2,
      title: "iPhone 12 Pro",
      price: 35999,
      originalPrice: 79999,
      image: "/iphone-12-pro.png",
      images: ["/iphone-12-pro.png", "/iphone-12-pro.png"],
      co2Saved: 45,
      waterSaved: 280,
      condition: "Very Good",
      location: "Mumbai",
      rating: 4.9,
      seller: "Tech Store",
      sellerScore: 1250,
      description:
        "iPhone 12 Pro in very good condition. Minor scratches on the back, screen is perfect. Comes with original charger and box. Free delivery in Mumbai.",
      isDonation: true,
      ngo: "Greenpeace India",
      reviews: [{ user: "Arjun P.", rating: 5, comment: "Perfect condition, great seller!" }],
    },
    {
      id: 3,
      title: "Wooden Coffee Table",
      price: 6999,
      originalPrice: 15999,
      image: "/wooden-coffee-table.png",
      images: ["/wooden-coffee-table.png", "/wooden-coffee-table.png"],
      co2Saved: 35,
      waterSaved: 100,
      condition: "Good",
      location: "Delhi NCR",
      rating: 4.7,
      seller: "Vikram R.",
      sellerScore: 800,
      description:
        "Sturdy wooden coffee table with a modern design. Perfect for any living room. Comes with original packaging. Free delivery in Delhi NCR.",
      isDonation: false,
      reviews: [{ user: "Kavya J.", rating: 4, comment: "Good quality, solid build." }],
    },
    {
      id: 4,
      title: "Designer Handbag",
      price: 9999,
      originalPrice: 28999,
      image: "/luxury-quilted-handbag.png",
      images: ["/luxury-quilted-handbag.png", "/luxury-quilted-handbag.png"],
      co2Saved: 20,
      waterSaved: 50,
      condition: "Like New",
      location: "Bengaluru",
      rating: 5.0,
      seller: "Fashion Hub",
      sellerScore: 1500,
      description:
        "Luxury designer handbag in like new condition. Comes with all original accessories. Perfect for any occasion. Free delivery in Bengaluru.",
      isDonation: false,
      reviews: [{ user: "Deepika L.", rating: 5, comment: "Absolutely stunning handbag." }],
    },
    {
      id: 5,
      title: "Gaming Laptop",
      price: 45999,
      originalPrice: 89999,
      image: "/gaming-laptop.png",
      images: ["/gaming-laptop.png", "/gaming-laptop.png"],
      co2Saved: 60,
      waterSaved: 400,
      condition: "Very Good",
      location: "Pune",
      rating: 4.6,
      seller: "TechGuru",
      sellerScore: 1100,
      description:
        "High-performance gaming laptop in very good condition. Perfect for gaming and professional work. Comes with original charger and box.",
      isDonation: false,
      reviews: [{ user: "Aditya S.", rating: 5, comment: "Excellent performance, great deal!" }],
    },
    {
      id: 6,
      title: "Yoga Mat Set",
      price: 1499,
      originalPrice: 3999,
      image: "/yoga-mat-set.png",
      images: ["/yoga-mat-set.png", "/yoga-mat-set.png"],
      co2Saved: 8,
      waterSaved: 25,
      condition: "Like New",
      location: "Chennai",
      rating: 4.8,
      seller: "Wellness Co.",
      sellerScore: 950,
      description:
        "Complete yoga mat set with blocks and strap. Like new condition, barely used. Perfect for home workouts and yoga practice.",
      isDonation: false,
      reviews: [{ user: "Meera T.", rating: 4, comment: "Great quality, very comfortable." }],
    },
  ]

  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", score: 2450, co2Saved: 125, avatar: "👩‍💼" },
    { rank: 2, name: "Mike Johnson", score: 2380, co2Saved: 118, avatar: "👨‍🔧" },
    { rank: 3, name: "Emma Davis", score: 2290, co2Saved: 112, avatar: "👩‍🎨" },
    { rank: 4, name: "Alex Kim", score: 2150, co2Saved: 105, avatar: "👨‍💻" },
    { rank: 5, name: "Lisa Wang", score: 2080, co2Saved: 98, avatar: "👩‍🔬" },
  ]

  const challenges = [
    {
      id: 1,
      title: "Zero Waste Week",
      description: "Buy only second-hand items for 7 days",
      progress: 65,
      target: 7,
      current: 4,
      reward: "50 Green Points",
    },
    {
      id: 2,
      title: "CO₂ Saver",
      description: "Save 100kg CO₂ this month",
      progress: 78,
      target: 100,
      current: 78,
      reward: "Eco Champion Badge",
    },
    {
      id: 3,
      title: "Community Helper",
      description: "Help 5 neighbors with swaps",
      progress: 40,
      target: 5,
      current: 2,
      reward: "Helper Badge",
    },
  ]

  const localServices = [
    { name: "Green Repair Café", type: "Repair", distance: "0.5 km", rating: 4.8, address: "123 Eco Street" },
    { name: "Swap Shop Central", type: "Exchange", distance: "1.2 km", rating: 4.9, address: "456 Green Ave" },
    { name: "Upcycle Workshop", type: "Workshop", distance: "2.1 km", rating: 4.7, address: "789 Sustain Blvd" },
  ]

  const ngoData = [
    {
      id: 1,
      name: "Green Earth Foundation",
      mission: "Protecting forests and wildlife through sustainable practices",
      verified: true,
      image: "/forest-conservation.png",
      impact: "50,000 trees planted this year",
      beneficiaries: 15000,
      urgentNeed: "Emergency flood relief - ₹2,00,000 needed",
      conversionRate: { amount: 500, impact: "10 meals for children" },
    },
    {
      id: 2,
      name: "Clean Water Initiative",
      mission: "Providing clean water access to rural communities",
      verified: true,
      image: "/clean-water-well.png",
      impact: "200 wells built, 80,000 people served",
      beneficiaries: 80000,
      urgentNeed: "Water purification systems - ₹5,00,000 needed",
      conversionRate: { amount: 500, impact: "Clean water for 5 families for 1 month" },
    },
    {
      id: 3,
      name: "Education for All",
      mission: "Ensuring quality education reaches every child",
      verified: true,
      image: "/children-studying.jpg",
      impact: "5,000 children educated, 100 schools built",
      beneficiaries: 5000,
      urgentNeed: "School supplies for remote areas - ₹1,00,000 needed",
      conversionRate: { amount: 500, impact: "School supplies for 20 children" },
    },
  ]

  const successStories = [
    {
      title: "From Drought to Abundance",
      description: "Thanks to your donations, the village of Rajpur now has 3 functioning wells serving 2,000 people.",
      beforeImage: "/drought-affected-village.jpg",
      afterImage: "/village-with-clean-water.jpg",
      impact: "2,000 lives transformed",
    },
    {
      title: "Education Changes Everything",
      description: "Maya, 12, can now attend school thanks to the scholarship program funded by your contributions.",
      beforeImage: "/child-working-instead-of-school.jpg",
      afterImage: "/happy-child-in-classroom.jpg",
      impact: "500+ children now in school",
    },
    {
      title: "Forest Restoration Success",
      description:
        "The Sundarbans restoration project has planted 10,000 mangrove trees, protecting coastal communities.",
      beforeImage: "/deforested-mangrove-area.jpg",
      afterImage: "/healthy-mangrove-forest.jpg",
      impact: "50,000 trees planted",
    },
  ]

  const recentDonations = [
    { donor: "Anonymous", amount: 2500, ngo: "Green Earth Foundation", time: "2 minutes ago" },
    { donor: "Priya S.", amount: 1000, ngo: "Clean Water Initiative", time: "5 minutes ago" },
    { donor: "Anonymous", amount: 5000, ngo: "Education for All", time: "8 minutes ago" },
    { donor: "Raj M.", amount: 750, ngo: "Green Earth Foundation", time: "12 minutes ago" },
  ]

  const topDonors = [
    { rank: 1, name: "Anonymous Hero", amount: 50000, donations: 25 },
    { rank: 2, name: "Eco Warrior", amount: 35000, donations: 18 },
    { rank: 3, name: "Green Guardian", amount: 28000, donations: 22 },
    { rank: 4, name: "Nature Lover", amount: 22000, donations: 15 },
    { rank: 5, name: "Earth Protector", amount: 18000, donations: 12 },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const partnerNGOs = [
    {
      id: 1,
      name: "Akshaya Patra Foundation",
      nameHindi: "अक्षय पात्र फाउंडेशन",
      mission: "Providing nutritious meals to school children across India",
      missionHindi: "भारत भर के स्कूली बच्चों को पौष्टिक भोजन प्रदान करना",
      verified: true,
      logo: "/akshaya-patra-foundation-logo.jpg",
      impact: "Fed 1,50,000 children this month",
      fundraisingGoal: 5000000,
      currentFunding: 3200000,
      locations: ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai"],
      suggestedAmounts: [100, 500, 1000, 2500],
      conversionRate: "₹50 feeds 1 child for a day",
    },
    {
      id: 2,
      name: "CRY - Child Rights and You",
      nameHindi: "सीआरवाई - चाइल्ड राइट्स एंड यू",
      mission: "Ensuring happy childhoods for underprivileged children",
      missionHindi: "वंचित बच्चों के लिए खुशहाल बचपन सुनिश्चित करना",
      verified: true,
      logo: "/cry-child-rights-and-you-logo.jpg",
      impact: "Educated 5,000+ kids this year",
      fundraisingGoal: 3000000,
      currentFunding: 2100000,
      locations: ["Mumbai", "Delhi", "Kolkata", "Pune", "Ahmedabad"],
      suggestedAmounts: [200, 750, 1500, 3000],
      conversionRate: "₹200 provides school supplies for 1 child",
    },
    {
      id: 3,
      name: "Goonj",
      nameHindi: "गूंज",
      mission: "Turning urban waste into rural development resource",
      missionHindi: "शहरी कचरे को ग्रामीण विकास संसाधन में बदलना",
      verified: true,
      logo: "/goonj-ngo-logo.jpg",
      impact: "Distributed 2,00,000 clothing items",
      fundraisingGoal: 2500000,
      currentFunding: 1800000,
      locations: ["Delhi", "Mumbai", "Bengaluru", "Jaipur", "Bhopal"],
      suggestedAmounts: [150, 600, 1200, 2000],
      conversionRate: "₹150 provides clothing for 1 family",
    },
    {
      id: 4,
      name: "Smile Foundation",
      nameHindi: "स्माइल फाउंडेशन",
      mission: "Empowering underprivileged children, youth and women",
      missionHindi: "वंचित बच्चों, युवाओं और महिलाओं को सशक्त बनाना",
      verified: true,
      logo: "/smile-foundation-logo.jpg",
      impact: "Empowered 25,000+ women entrepreneurs",
      fundraisingGoal: 4000000,
      currentFunding: 2800000,
      locations: ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad"],
      suggestedAmounts: [250, 800, 1600, 4000],
      conversionRate: "₹250 provides skill training for 1 woman",
    },
    {
      id: 5,
      name: "Teach for India",
      nameHindi: "टीच फॉर इंडिया",
      mission: "Building a movement to eliminate educational inequity",
      missionHindi: "शैक्षिक असमानता को खत्म करने के लिए एक आंदोलन का निर्माण",
      verified: true,
      logo: "/teach-for-india-logo.jpg",
      impact: "Transformed 50,000+ student lives",
      fundraisingGoal: 6000000,
      currentFunding: 4200000,
      locations: ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai"],
      suggestedAmounts: [300, 1000, 2000, 5000],
      conversionRate: "₹300 sponsors 1 child's education for a month",
    },
  ]

  const NGOPartnerShowcase = () => (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured NGO Partners</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Support verified NGOs making real impact across India. Every donation is tracked and creates measurable
          change.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partnerNGOs.map((ngo) => (
          <Card key={ngo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* NGO Header */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={ngo.logo || "/placeholder.svg"}
                  alt={`${ngo.name} logo`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{ngo.name}</h3>
                    {ngo.verified && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{ngo.nameHindi}</p>
                </div>
              </div>

              {/* Mission */}
              <div className="mb-4">
                <p className="text-sm mb-2">{ngo.mission}</p>
                <p className="text-xs text-muted-foreground italic">{ngo.missionHindi}</p>
              </div>

              {/* Impact Metrics */}
              <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div className="text-sm font-semibold text-primary mb-1">This Month's Impact</div>
                <div className="text-lg font-bold">{ngo.impact}</div>
              </div>

              {/* Fundraising Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fundraising Goal</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{(ngo.currentFunding / 100000).toFixed(1)}L / ₹{(ngo.fundraisingGoal / 100000).toFixed(1)}L
                  </span>
                </div>
                <Progress value={(ngo.currentFunding / ngo.fundraisingGoal) * 100} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  {Math.round((ngo.currentFunding / ngo.fundraisingGoal) * 100)}% of goal reached
                </div>
              </div>

              {/* Location Tags */}
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">Operating in:</div>
                <div className="flex flex-wrap gap-1">
                  {ngo.locations.slice(0, 3).map((location) => (
                    <Badge key={location} variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                  {ngo.locations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{ngo.locations.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="mb-4 p-2 bg-secondary/10 rounded text-center">
                <div className="text-sm font-medium text-secondary">{ngo.conversionRate}</div>
              </div>

              {/* Suggested Amounts */}
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">Quick Donate:</div>
                <div className="grid grid-cols-4 gap-1">
                  {ngo.suggestedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-transparent"
                      onClick={() => {
                        setDonationQuickAmount(amount)
                        // Could trigger donation flow here
                      }}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Donate Now Button */}
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Heart className="w-4 h-4 mr-2" />
                Donate Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const CommunityPage = () => (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowCommunity(false)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold">Community</h1>
        <div className="w-16" />
      </div>

      {/* Community Stats Banner */}
      <div className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-primary-foreground mb-2">Our Impact Together</h2>
            <p className="text-primary-foreground/80">Building a sustainable future, one item at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground">2.5M+</div>
              <div className="text-sm text-primary-foreground/80">Items Saved</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground">500K</div>
              <div className="text-sm text-primary-foreground/80">kg CO₂ Prevented</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground">50K+</div>
              <div className="text-sm text-primary-foreground/80">Active Members</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground">1.2M</div>
              <div className="text-sm text-primary-foreground/80">Liters Water Saved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="services">Local Services</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Top Eco-Savers This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboardData.map((user) => (
                  <div key={user.rank} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.co2Saved}kg CO₂ saved</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{user.score}</div>
                      <div className="text-xs text-muted-foreground">Green Points</div>
                    </div>
                    {user.rank <= 3 && (
                      <Medal
                        className={`w-5 h-5 ${user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-gray-400" : "text-amber-600"}`}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Active Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {challenge.reward}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Progress: {challenge.current}/{challenge.target}
                        </span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                    <Button size="sm" className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Join Challenge
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Local Eco Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {localServices.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.address}</p>
                      </div>
                      <Badge variant="secondary">{service.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {service.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {service.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Globe className="w-4 h-4 mr-2" />
                        Visit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MapPin className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {successStories.map((story) => (
                  <div key={story.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{story.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold">{story.user}</div>
                        <p className="text-sm text-muted-foreground mt-1">{story.story}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        {story.impact}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          {story.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  const ProductView = ({ productId }: { productId: number }) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return null

    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80"
                      onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80"
                      onClick={() => setCurrentImageIndex(Math.min(product.images.length - 1, currentImageIndex + 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                    <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </Badge>
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">{product.seller.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.seller}</span>
                      <Badge variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {product.sellerScore}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {product.rating} • {product.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Eco Impact - Prominent Display */}
              <Card className="bg-secondary/20 border-secondary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-secondary" />
                    Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <TreePine className="w-6 h-6 text-secondary mx-auto mb-1" />
                      <div className="text-2xl font-bold text-secondary">{product.co2Saved}kg</div>
                      <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-blue-600">{product.waterSaved}L</div>
                      <div className="text-xs text-muted-foreground">Water Saved</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    By buying this item, you're preventing waste and reducing environmental impact!
                  </p>
                </CardContent>
              </Card>

              {/* NGO Info Card for Donation Sales */}
              {product.isDonation && product.ngo && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">Donation Sale</h3>
                        <p className="text-sm text-green-700">
                          Proceeds support <strong>{product.ngo}</strong>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:flex gap-3">
                <Button size="lg" className="flex-1" onClick={() => setShowPayment(true)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
                <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Swap
                </Button>
                <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Borrow
                </Button>
              </div>

              {/* Additional Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Buyer Protection
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Free Local Pickup
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Listed 2 days ago
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="eco-impact">Eco Impact</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Item Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Condition</h4>
                        <Badge variant="outline">{product.condition}</Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {product.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="eco-impact" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Environmental Benefits</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <TreePine className="w-5 h-5 text-secondary" />
                          <div>
                            <div className="font-medium">Carbon Footprint Reduction</div>
                            <div className="text-sm text-muted-foreground">Prevents manufacturing emissions</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {product.co2Saved}kg CO₂
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Droplets className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="font-medium">Water Conservation</div>
                            <div className="text-sm text-muted-foreground">Saves production water usage</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-lg px-3 py-1 border-blue-200 text-blue-700">
                          {product.waterSaved}L
                        </Badge>
                      </div>

                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          By choosing second-hand, you're contributing to a circular economy and helping reduce waste in
                          landfills. This item would have otherwise contributed to environmental pollution through
                          manufacturing and disposal.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold">Customer Reviews</h3>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviews.length} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{review.user.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">{review.user}</div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sticky Mobile Bottom Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setShowPayment(true)}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy ₹{product.price}
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const SellItemForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Sell Your Item</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowSellForm(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complete your listing</span>
              <span>{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Photos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Camera className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Drag photos here or click to browse</p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Item Details</Label>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="What are you selling?" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item's condition, features, and why it's great..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="very-good">Very Good</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sale Type Toggle */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Sale Type</Label>
            <div className="flex gap-4">
              <Button
                variant={saleType === "normal" ? "default" : "outline"}
                onClick={() => setSaleType("normal")}
                className="flex-1"
              >
                Normal Sale
              </Button>
              <Button
                variant={saleType === "donation" ? "default" : "outline"}
                onClick={() => setSaleType("donation")}
                className="flex-1"
              >
                Donation Sale
              </Button>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Pricing</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Your Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input id="price" placeholder="0.00" className="pl-8" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="original-price">Original Price (optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input id="original-price" placeholder="0.00" className="pl-8" />
                </div>
              </div>
            </div>
          </div>

          {/* NGO Dropdown for Donation Sales */}
          {saleType === "donation" && (
            <div className="space-y-2">
              <Label htmlFor="ngo">Select NGO Partner</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an NGO to support" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greenpeace">Greenpeace</SelectItem>
                  <SelectItem value="wwf">World Wildlife Fund</SelectItem>
                  <SelectItem value="earth-day">Earth Day Network</SelectItem>
                  <SelectItem value="ocean-conservancy">Ocean Conservancy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="location" placeholder="Enter your city or postal code" className="pl-10" />
            </div>
          </div>

          {/* Delivery Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Delivery Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="pickup" />
                <Label htmlFor="pickup" className="text-sm">
                  Local pickup available
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="shipping" />
                <Label htmlFor="shipping" className="text-sm">
                  Willing to ship
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="meetup" />
                <Label htmlFor="meetup" className="text-sm">
                  Meet in public place
                </Label>
              </div>
            </div>
          </div>

          {/* Eco Impact Preview */}
          <Card className="bg-secondary/20 border-secondary">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Leaf className="w-4 h-4 text-secondary" />
                Environmental Impact Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-secondary" />
                  <span className="text-sm">CO₂ Saved</span>
                </div>
                <Badge variant="secondary">~25kg CO₂</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Water Saved</span>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  ~150L
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                By selling this item, you're helping reduce waste and environmental impact!
              </p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button className="w-full" size="lg">
            List Your Item
          </Button>
        </div>
      </div>
    </div>
  )

  const UserProfile = () => (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 mb-6 text-primary-foreground">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">{userProfile.avatar}</span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <Badge
                  variant="secondary"
                  className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                >
                  <Award className="w-4 h-4 mr-1" />
                  Green Score: {userProfile.greenScore}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30"
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  {userProfile.ecoLevel}
                </Badge>
                <span className="text-sm opacity-90">Member since {userProfile.joinDate}</span>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.totalImpact.co2Saved}kg</div>
                  <div className="text-sm opacity-90">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.totalImpact.waterSaved}L</div>
                  <div className="text-sm opacity-90">Water Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.totalImpact.itemsSaved}</div>
                  <div className="text-sm opacity-90">Items Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userProfile.totalImpact.treesEquivalent}</div>
                  <div className="text-sm opacity-90">Trees Equivalent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shareable Impact Stats */}
        <Card className="mb-6 bg-secondary/10 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <div>
                  <h3 className="font-semibold">Share Your Impact</h3>
                  <p className="text-sm text-muted-foreground">Show the world your environmental contribution</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="impact" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="impact">Impact Charts</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="history">Purchase History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Impact Charts Tab */}
          <TabsContent value="impact" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CO₂ Savings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="w-5 h-5 text-secondary" />
                    CO₂ Savings Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      co2: {
                        label: "CO₂ Saved (kg)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userProfile.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="co2" stroke="var(--color-co2)" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Water Savings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    Water Savings Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      water: {
                        label: "Water Saved (L)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userProfile.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="water" fill="var(--color-water)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Impact Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Environmental Impact Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <TreePine className="w-5 h-5 text-secondary" />
                          <div>
                            <div className="font-medium">Total CO₂ Prevented</div>
                            <div className="text-sm text-muted-foreground">
                              Equivalent to {userProfile.totalImpact.treesEquivalent} trees planted
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {userProfile.totalImpact.co2Saved}kg
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Droplets className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="font-medium">Water Conservation</div>
                            <div className="text-sm text-muted-foreground">Enough for 140 showers</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-lg px-3 py-1 border-blue-200 text-blue-700">
                          {userProfile.totalImpact.waterSaved}L
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">Your Green Score Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Items Sold</span>
                            <span>+400 points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Items Purchased</span>
                            <span>+300 points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Community Engagement</span>
                            <span>+250 points</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Eco Impact Bonus</span>
                            <span>+300 points</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Green Score</span>
                            <span>{userProfile.greenScore}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  My Listings ({userProfile.listings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.listings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{listing.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>${listing.price}</span>
                          <span>{listing.views} views</span>
                          <span>{listing.likes} likes</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={listing.status === "Active" ? "default" : "secondary"}>{listing.status}</Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Listing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Purchase History ({userProfile.purchases.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile.purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{purchase.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Sold by {purchase.seller}</span>
                          <span>{purchase.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">${purchase.price}</span>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfile.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 border rounded-lg text-center ${
                        achievement.earned ? "bg-secondary/10 border-secondary" : "bg-muted/50 border-muted"
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h3
                        className={`font-semibold mb-1 ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {achievement.name}
                      </h3>
                      <p
                        className={`text-sm ${achievement.earned ? "text-muted-foreground" : "text-muted-foreground/70"}`}
                      >
                        {achievement.description}
                      </p>
                      {achievement.earned && (
                        <Badge variant="secondary" className="mt-2">
                          Earned
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settings Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" defaultValue={userProfile.name} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="alex.johnson@email.com" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Notification Preferences</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notifications" defaultChecked />
                      <Label htmlFor="email-notifications" className="text-sm">
                        Email notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="push-notifications" defaultChecked />
                      <Label htmlFor="push-notifications" className="text-sm">
                        Push notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="marketing-emails" />
                      <Label htmlFor="marketing-emails" className="text-sm">
                        Marketing emails
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const NGOShowcasePage = () => (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowNGOShowcase(false)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold">Support NGOs</h1>
        <div className="w-16" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <NGOPartnerShowcase />

        {/* Hero Section with Rotating Stories */}
        <div className="relative h-96 bg-gradient-to-r from-primary to-secondary overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/40" />
          <img
            src={successStories[currentStoryIndex].afterImage || "/placeholder.svg"}
            alt="Success story"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Together, We Can Heal the Planet!</h1>
              <p className="text-xl mb-6 opacity-90">{successStories[currentStoryIndex].description}</p>
              <div className="flex items-center gap-4 mb-6">
                <Badge className="bg-accent text-accent-foreground px-4 py-2 text-lg">
                  {successStories[currentStoryIndex].impact}
                </Badge>
              </div>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
            </div>
          </div>

          {/* Story indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStoryIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentStoryIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Social Proof Banner */}
        <div className="bg-card rounded-lg p-6 mb-8 border">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Join 1,234 People Who Donated This Month</h2>
            <p className="text-muted-foreground mb-4">Together we've raised ₹12,45,000 for various causes</p>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">₹12.45L</div>
                <div className="text-sm text-muted-foreground">Total Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">1,234</div>
                <div className="text-sm text-muted-foreground">Active Donors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">25</div>
                <div className="text-sm text-muted-foreground">NGOs Supported</div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Donation Impact Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Your Donation Impact</CardTitle>
            <p className="text-center text-muted-foreground">See exactly how your contribution makes a difference</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {ngoData.map((ngo) => (
                <div key={ngo.id} className="text-center p-4 bg-background rounded-lg border">
                  <h3 className="font-semibold mb-2">{ngo.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-2">₹{ngo.conversionRate.amount}</div>
                  <div className="text-sm text-muted-foreground mb-4">=</div>
                  <div className="text-lg font-semibold text-secondary">{ngo.conversionRate.impact}</div>
                  <Progress value={75} className="mt-4" />
                  <div className="text-xs text-muted-foreground mt-2">75% of monthly goal reached</div>
                </div>
              ))}
            </div>

            {/* Instant Impact Calculator */}
            <div className="mt-8 p-6 bg-background rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-center">Instant Impact Calculator</h3>
              <div className="flex items-center justify-center gap-4 mb-4">
                <Label htmlFor="donation-amount">Donation Amount: ₹</Label>
                <Input
                  id="donation-amount"
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-32"
                />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  Your ₹{donationAmount} can provide {Math.floor(donationAmount / 50)} meals for children
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Donation Counter & Recent Donations */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Live Donation Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">₹12,45,678</div>
                <div className="text-muted-foreground mb-4">Raised this month</div>
                <Progress value={62} className="mb-2" />
                <div className="text-sm text-muted-foreground">62% of ₹20L monthly goal</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <div className="font-semibold">{donation.donor}</div>
                      <div className="text-sm text-muted-foreground">{donation.ngo}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹{donation.amount}</div>
                      <div className="text-xs text-muted-foreground">{donation.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NGO Profiles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured NGOs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ngoData.map((ngo) => (
              <Card key={ngo.id} className="overflow-hidden">
                <div className="relative">
                  <img src={ngo.image || "/placeholder.svg"} alt={ngo.name} className="w-full h-48 object-cover" />
                  {ngo.verified && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{ngo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{ngo.mission}</p>
                  <div className="text-sm font-semibold text-primary mb-2">{ngo.impact}</div>
                  <div className="text-xs text-muted-foreground mb-4">
                    {ngo.beneficiaries.toLocaleString()} beneficiaries
                  </div>

                  {/* Emergency Alert */}
                  <div className="bg-accent/10 border border-accent/20 rounded p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold text-accent">Urgent Need</span>
                    </div>
                    <div className="text-sm">{ngo.urgentNeed}</div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Donation Leaderboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Donors This Month
            </CardTitle>
            <p className="text-muted-foreground">Celebrating our generous community members</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDonors.map((donor) => (
                <div key={donor.rank} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {donor.rank}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{donor.name}</div>
                    <div className="text-sm text-muted-foreground">{donor.donations} donations</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">₹{donor.amount.toLocaleString()}</div>
                  </div>
                  {donor.rank <= 3 && (
                    <Medal
                      className={`w-5 h-5 ${
                        donor.rank === 1 ? "text-yellow-500" : donor.rank === 2 ? "text-gray-400" : "text-amber-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Before/After Transformation Gallery */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Transformation Stories</CardTitle>
            <p className="text-muted-foreground">See the real impact of your donations</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold">{story.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <img
                        src={story.beforeImage || "/placeholder.svg"}
                        alt="Before"
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="text-xs text-center mt-1 text-muted-foreground">Before</div>
                    </div>
                    <div>
                      <img
                        src={story.afterImage || "/placeholder.svg"}
                        alt="After"
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="text-xs text-center mt-1 text-muted-foreground">After</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{story.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {story.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Impact Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Monthly Impact Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Donation Distribution</h3>
                <ChartContainer
                  config={{
                    education: { label: "Education", color: "hsl(var(--chart-1))" },
                    water: { label: "Clean Water", color: "hsl(var(--chart-2))" },
                    environment: { label: "Environment", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: "Education", amount: 450000 },
                        { category: "Water", amount: 380000 },
                        { category: "Environment", amount: 415000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="var(--color-chart-1)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Key Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>15,000 children received education support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>200 water wells constructed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>50,000 trees planted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>100 communities reached</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const PaymentPage = () => (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowPayment(false)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-bold">Payment</h1>
        <div className="w-16" />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/vintage-leather-jacket.png"
                alt="Vintage Leather Jacket"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">Vintage Leather Jacket</h3>
                <p className="text-sm text-muted-foreground">Excellent condition</p>
                <Badge variant="secondary" className="mt-1">
                  <Leaf className="w-3 h-3 mr-1" />
                  Saves 20kg CO₂
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">₹1,299</div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Item Price</span>
                <span>₹1,299</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-primary">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹1,299</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-6">
          {/* UPI Section */}
          <Card className={selectedPaymentMethod === "upi" ? "ring-2 ring-primary" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={selectedPaymentMethod === "upi"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <h3 className="text-lg font-semibold">UPI</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Recommended
                  </Badge>
                </div>
              </div>

              {selectedPaymentMethod === "upi" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-16 flex flex-col items-center gap-2 bg-transparent">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span className="text-xs">Google Pay</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col items-center gap-2 bg-transparent">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <span className="text-xs">PhonePe</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col items-center gap-2 bg-transparent">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">P</span>
                      </div>
                      <span className="text-xs">Paytm</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col items-center gap-2 bg-transparent">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                      <span className="text-xs">BHIM</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input placeholder="Enter UPI ID" />
                    </div>
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan QR
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Net Banking */}
          <Card className={selectedPaymentMethod === "netbanking" ? "ring-2 ring-primary" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="radio"
                  name="payment"
                  value="netbanking"
                  checked={selectedPaymentMethod === "netbanking"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <h3 className="text-lg font-semibold">Net Banking</h3>
              </div>

              {selectedPaymentMethod === "netbanking" && (
                <div className="space-y-4">
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sbi">State Bank of India</SelectItem>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                      <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cards */}
          <Card className={selectedPaymentMethod === "card" ? "ring-2 ring-primary" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPaymentMethod === "card"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <h3 className="text-lg font-semibold">Credit/Debit Card</h3>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                    R
                  </div>
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    V
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    M
                  </div>
                </div>
              </div>

              {selectedPaymentMethod === "card" && (
                <div className="space-y-4">
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVV" />
                  </div>
                  <Input placeholder="Cardholder Name" />

                  {/* EMI Option */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="font-medium">EMI Available</span>
                      <Badge variant="secondary">₹2000+</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Convert to EMI for purchases above ₹2000. No cost EMI available.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donation Section */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Add a Donation</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                ₹50 feeds a child for a day. Your small contribution makes a big difference.
              </p>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[100, 500, 1000, 2000].map((amount) => (
                  <Button
                    key={amount}
                    variant={donationQuickAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDonationQuickAmount(amount)}
                    className="text-xs"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              <Input
                placeholder="Enter custom amount"
                value={donationQuickAmount || ""}
                onChange={(e) => setDonationQuickAmount(Number(e.target.value))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 my-6 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-primary" />
          <span>100% Secure Payment</span>
        </div>

        {/* Pay Button */}
        <Button size="lg" className="w-full text-lg font-semibold" disabled={!selectedPaymentMethod}>
          Pay ₹{1299 + (donationQuickAmount || 0)}
          {donationQuickAmount > 0 && (
            <span className="ml-2 text-sm opacity-80">(includes ₹{donationQuickAmount} donation)</span>
          )}
        </Button>
      </div>
    </div>
  )

  if (selectedProduct) {
    return <ProductView productId={selectedProduct} />
  }

  if (showProfile) {
    return <UserProfile />
  }

  if (showCommunity) {
    return <CommunityPage />
  }

  if (showNGOShowcase) {
    return <NGOShowcasePage />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">EcoFriend</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for eco-friendly items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Green Score Badge */}
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1">
                <Award className="w-4 h-4 mr-1" />
                Green Score: 850
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowNGOShowcase(true)}>
                <Heart className="w-4 h-4 mr-2" />
                Support NGOs
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowCommunity(true)}>
                <Users className="w-4 h-4 mr-2" />
                Community
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowProfile(true)}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Diwali Banner */}
      <div className="bg-orange-500 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg text-white">🪔</span>
            <span className="font-semibold text-white">Diwali Special – Go Green This Festival</span>
            <span className="text-lg text-white">✨</span>
          </div>
        </div>
      </div>

      {/* Community Stats Banner */}
      <div className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-primary-foreground">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
              <span className="text-primary-foreground">2.5M+ Items Saved</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground">
              <Leaf className="w-4 h-4 text-primary-foreground" />
              <span className="text-primary-foreground">500K kg CO₂ Prevented</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground">
              <Users className="w-4 h-4 text-primary-foreground" />
              <span className="text-primary-foreground">50K+ Happy Members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>

              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-muted-foreground">City</h4>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="jaipur">Jaipur</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="kochi">Kochi</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                  <MapPin className="w-3 h-3 mr-1" />
                  Detect my area
                </Button>
              </div>

              {selectedCity && (
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground">Local Area</h4>
                  <Select value={selectedLocalArea} onValueChange={setSelectedLocalArea}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCity === "bengaluru" && (
                        <>
                          <SelectItem value="koramangala">Koramangala</SelectItem>
                          <SelectItem value="whitefield">Whitefield</SelectItem>
                          <SelectItem value="indiranagar">Indiranagar</SelectItem>
                        </>
                      )}
                      {selectedCity === "mumbai" && (
                        <>
                          <SelectItem value="bandra">Bandra</SelectItem>
                          <SelectItem value="andheri">Andheri</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-muted-foreground">Price Range</h4>
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500">Under ₹500</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                    <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                    <SelectItem value="5000-plus">₹5,000+</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom price range inputs */}
                <div className="flex gap-2">
                  <Input placeholder="Min ₹" className="text-sm" />
                  <Input placeholder="Max ₹" className="text-sm" />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-muted-foreground">Distance</h4>
                <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5km">Within 5km</SelectItem>
                    <SelectItem value="10km">Within 10km</SelectItem>
                    <SelectItem value="same-city">Same city</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Condition Filter */}
              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Condition</h4>
                {["Like New", "Excellent", "Very Good", "Good"].map((condition) => (
                  <label key={condition} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    {condition}
                  </label>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Payment Methods</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    UPI
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Paytm
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    PhonePe
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    GPay
                  </Badge>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                      Saves {product.co2Saved}kg CO₂
                    </Badge>
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/90 rounded-full px-2 py-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {product.rating}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-card-foreground mb-2 text-balance">{product.title}</h3>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                      <span>•</span>
                      <span>{product.condition}</span>
                    </div>

                    {(product.location === "Bengaluru" ||
                      product.location === "Mumbai" ||
                      product.location === "Delhi NCR") && (
                      <div className="text-xs text-green-600 mb-2">Free delivery in {product.location}</div>
                    )}

                    <div className="text-xs text-muted-foreground mb-4">Sold by {product.seller}</div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Buy
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Swap
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Borrow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Sell Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        onClick={() => setShowSellForm(true)}
      >
        <Plus className="w-5 h-5 mr-2" />
        Sell Item
      </Button>

      {/* Sell Form Modal */}
      {showSellForm && <SellItemForm />}

      {/* Product View Modal */}
      {selectedProduct && <ProductView productId={selectedProduct} />}

      {/* User Profile Modal */}
      {showProfile && <UserProfile />}

      {showCommunity && <CommunityPage />}

      {showNGOShowcase && <NGOShowcasePage />}

      {showPayment && <PaymentPage />}
    </div>
  )
}
