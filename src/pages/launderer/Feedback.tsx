import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageSquare, Star, Package, Calendar, User } from "lucide-react";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useStore } from "@/store/useStore";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Feedback as FeedbackType } from "@/lib/firebase/firestore";
import { format } from "date-fns";

const Feedback = () => {
  const { orders } = useFirebaseOrders();
  const { currentUser } = useStore();
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    const feedbackQuery = query(
      collection(db, 'feedback'),
      where('laundererId', '==', currentUser.id)
    );

    const unsubscribe = onSnapshot(
      feedbackQuery,
      (snapshot) => {
        const feedbackData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as FeedbackType[];
        setFeedback(feedbackData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching feedback:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.id]);

  const myFeedback = useMemo(() => {
    return feedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [feedback]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = useMemo(() => {
    if (myFeedback.length === 0) return 0;
    const total = myFeedback.reduce((acc, f) => acc + f.rating, 0);
    return (total / myFeedback.length).toFixed(1);
  }, [myFeedback]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-32 h-6" />
            <div className="w-10" />
          </div>
        </div>
        <div className="px-6 space-y-4">
          <Skeleton className="w-full h-40 rounded-[2rem]" />
          <Skeleton className="w-full h-40 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Customer Feedback</h1>
          <div className="w-10" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-white" />
              <p className="text-white/80 text-sm">Total Reviews</p>
            </div>
            <p className="text-white text-2xl font-bold">{myFeedback.length}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-white fill-white" />
              <p className="text-white/80 text-sm">Avg Rating</p>
            </div>
            <p className="text-white text-2xl font-bold">
              {myFeedback.length > 0 ? `${averageRating} ⭐` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {myFeedback.length === 0 ? (
          <Card className="rounded-[2rem] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">No Feedback Yet</h3>
            <p className="text-muted-foreground text-sm">
              Customer feedback will appear here once you complete orders
            </p>
          </Card>
        ) : (
          myFeedback.map((item) => {
            const order = orders.find(o => o.id === item.orderId);
            
            return (
              <Card key={item.id} className="rounded-[2rem] p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(item.rating)}
                      <Badge className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                        {item.status === 'new' ? 'New' : 'Reviewed'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{item.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>Order #{item.orderId.slice(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {item.feedback && (
                  <div className="bg-muted/30 rounded-2xl p-4 mb-3">
                    <p className="text-sm text-foreground/90 leading-relaxed">{item.feedback}</p>
                  </div>
                )}

                {item.adminNotes && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-blue-600 mb-2">Admin Notes</p>
                    <p className="text-sm text-foreground/90">{item.adminNotes}</p>
                    {item.reviewedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Reviewed on {format(new Date(item.reviewedAt), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feedback;
