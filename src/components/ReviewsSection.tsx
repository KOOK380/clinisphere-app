import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  userId: number;
  userName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  courseId?: number;
  eventId?: number;
  isPurchased?: boolean;
}

export default function ReviewsSection({ courseId, eventId, isPurchased }: ReviewsSectionProps) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId, eventId]);

  const fetchReviews = async () => {
    try {
      const targetId = courseId ? `courseId=${courseId}` : `eventId=${eventId}`;
      const res = await fetch(`/api/reviews?${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPurchased) {
      toast.error('You must purchase this item to leave a review.');
      return;
    }
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, eventId, rating: newRating, comment: newComment })
      });
      
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to submit review');
        setSubmitting(false);
        return;
      }
      
      toast.success('Review submitted successfully!');
      setNewComment('');
      setNewRating(5);
      fetchReviews();
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded-xl"></div>;

  return (
    <div className="space-y-8 mt-12 border-t border-gray-100 pt-12">
      <h3 className="text-2xl font-black text-[#1E3A8A]">Reviews ({reviews.length})</h3>
      
      {isPurchased && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">Leave a Review</h4>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                className={`text-2xl ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full p-4 border border-gray-200 rounded-xl mb-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
          ></textarea>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="flex items-center gap-2 bg-[#1E3A8A] text-white px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-blue-800 disabled:opacity-50"
          >
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900">{review.userName}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
            <span className="text-xs text-gray-400 mt-4 block">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
        {reviews.length === 0 && !isPurchased && (
          <p className="text-gray-500 italic">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
