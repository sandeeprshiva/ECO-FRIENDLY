import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Heart, MapPin, Leaf, Star, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ItemCard = ({ item, onFavorite, onContact, isFavorite = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'sell': return 'bg-blue-100 text-blue-800';
      case 'donate': return 'bg-green-100 text-green-800';
      case 'swap': return 'bg-purple-100 text-purple-800';
      case 'borrow': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {item.images && item.images.length > 0 ? (
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white"
                onClick={() => onFavorite?.(item.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`} 
                />
              </Button>
            </div>
            <div className="absolute top-2 left-2">
              <Badge className={getTransactionTypeColor(item.transactionType)}>
                {item.transactionType}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <Image
                src="/placeholder.jpg"
                alt="No image"
                width={100}
                height={100}
                className="opacity-50"
              />
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(item.price)}
            </span>
            <Badge className={getConditionColor(item.condition)}>
              {item.condition}
            </Badge>
          </div>
          
          {item.ecoSavings && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <Leaf className="h-4 w-4" />
              <span>Eco Impact: {item.ecoSavings}kg CO₂ saved</span>
            </div>
          )}
          
          {item.seller && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.seller.avatar} />
                <AvatarFallback>
                  {item.seller.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.seller.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {item.seller.rating || '4.5'} ({item.seller.reviewCount || 0})
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/items/${item.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => onContact?.(item)}
          className="flex-1"
        >
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
