import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { reviewDonationRequest } from '@/support';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { CompleteDonationReviewPost } from '@donohub/shared';
import { cn } from '@/lib/utils';

type ReviewDialogProps = {
  donationId: string;
  onClose: () => void;
};

export const ReviewDialog = ({ donationId, onClose }: ReviewDialogProps) => {
  const queryClient = useQueryClient();

  const ratingArr = [1, 2, 3, 4, 5];
  const [review, setReview] = useState(0);
  const [selectedReview, setSelectedReview] = useState(0);
  const [hasError, setError] = useState(false);

  const reviewDonationFn = useAuthRequest(reviewDonationRequest);
  const reviewDonationMutation = useMutation({
    mutationKey: ['reviewDonation', donationId],
    mutationFn: (body: CompleteDonationReviewPost) =>
      reviewDonationFn({
        body,
        pathParams: [{ key: ':donationId', value: donationId }],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryDonations'] });
    },
  });

  const handleClose = (value: boolean) => {
    if (!value) {
      setReview(0);
      setSelectedReview(0);
      onClose();
    }
  };

  return (
    <Dialog onOpenChange={handleClose} open={!!donationId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm received</DialogTitle>
        </DialogHeader>
        <DialogDescription>Please review the donation</DialogDescription>
        <div
          className="flex flex-row gap-2 w-fit"
          onMouseLeave={() => setReview(0)}
        >
          {ratingArr.map((value) => (
            <Star
              size={25}
              key={value}
              fill={
                review > value || selectedReview >= value ? 'yellow' : 'white'
              }
              onMouseEnter={() => setReview(value)}
              onClick={() => {
                setSelectedReview(value);
                setError(false);
              }}
              className={cn(
                'hover:fill-yellow-300 cursor-pointer',
                hasError ? 'text-red-500' : '',
              )}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'ghost'} className="cursor-pointer">
              Close
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            onClick={() => {
              if (selectedReview > 0) {
                handleClose(false);
                reviewDonationMutation.mutate({ rating: selectedReview });
              } else {
                setError(true);
              }
            }}
          >
            Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
