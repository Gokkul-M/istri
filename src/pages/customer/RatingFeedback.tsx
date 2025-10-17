import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RatingFeedback = () => {
  const { orderId } = useParams();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thank You!",
      description: "Your feedback has been submitted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <Link to={`/customer/order/${orderId}`}>
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Rate Service</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 space-y-6">
        <Card className="rounded-[2rem] p-8 text-center shadow-soft border-border/30">
          <h2 className="text-2xl font-bold mb-2 tracking-tight">How was your experience?</h2>
          <p className="text-muted-foreground mb-6">Your feedback helps us improve</p>

          {/* Star Rating */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted'
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Great!"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </p>
            </div>
          )}
        </Card>

        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Share your feedback (Optional)</h3>
          <Textarea
            placeholder="Tell us about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="rounded-2xl min-h-32"
          />
        </Card>

        <Button onClick={handleSubmit} variant="hero" className="w-full" size="lg">
          <Send className="w-4 h-4 mr-2" />
          Submit Feedback
        </Button>

        <Card className="rounded-3xl p-6 gradient-secondary border-0 text-white">
          <p className="text-sm text-white/90 text-center">
            Your privacy is important. Feedback is anonymous and used only to improve our service.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RatingFeedback;
