// Create a new file: app/components/Order/CancelOrderModal.tsx
import { useState } from 'react';
import { useFetcher } from 'react-router';

interface CancelOrderModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelOrderModal({ orderId, isOpen, onClose }: CancelOrderModalProps) {
  const [staffNote, setStaffNote] = useState('');
  const [refundMethod, setRefundMethod] = useState<'originalPaymentMethodsRefund' | 'giftCardRefund'>('originalPaymentMethodsRefund');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetcher = useFetcher();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetcher.submit(
      {
        orderId,
        notifyCustomer: 'true',
        refundMethod: JSON.stringify({ [refundMethod]: true }),
        restock: 'true',
        reason: 'CUSTOMER',
        staffNote,
      },
      { method: 'post', action: '/api/order/cancel' }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Cancel Order</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="refundMethod"
                  value="originalPaymentMethodsRefund"
                  checked={refundMethod === 'originalPaymentMethodsRefund'}
                  onChange={() => setRefundMethod('originalPaymentMethodsRefund')}
                  className="mr-2"
                />
                Original Payment Method
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="refundMethod"
                  value="giftCardRefund"
                  checked={refundMethod === 'giftCardRefund'}
                  onChange={() => setRefundMethod('giftCardRefund')}
                  className="mr-2"
                />
                Gift Card
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="staffNote" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Cancellation
            </label>
            <textarea
              id="staffNote"
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              required
              placeholder="Please provide a reason for cancellation..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={isSubmitting || !staffNote.trim()}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}