
import { Star } from 'lucide-react';
import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Review {
  id: number;
  user: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-medium border-0">
      <h3 className="font-semibold text-foreground mb-4">Avaliações</h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start space-x-3">
              <img
                alt={`Avatar de ${review.user}`}
                className="w-10 h-10 rounded-full"
                loading="lazy"
                src={review.userAvatar}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground">{review.user}</p>
                    {review.verified && (
                      <Badge className="text-xs" variant="secondary">
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-info text-info" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{review.comment}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReviewsList;
