import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Api from '@/Api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type Subscription = {
    id: number;
    status: string;
    startDate: string;
    endDate: string;
    amount: number;
    paymentMethod?: string;
    createdAt: string;
};

const SubscriptionCard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const response = await Api.get('/api/subscriptions');
                setIsSubscribed(response.data.isSubscribed);
                setSubscription(response.data.subscription);
            } catch (error) {
                console.error('Failed to fetch subscription:', error);
                toast.error('Failed to load subscription information');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const handleRenew = () => {
        navigate('/study/subscription/renew');
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your subscription?')) {
            return;
        }

        try {
            setLoading(true);
            await Api.post('/api/subscriptions/cancel');
            toast.success('Subscription canceled successfully');

            // Refresh subscription data
            const response = await Api.get('/api/subscriptions');
            setIsSubscribed(response.data.isSubscribed);
            setSubscription(response.data.subscription);
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            toast.error('Failed to cancel subscription');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = () => {
        navigate('/study/subscription/new');
    };

    if (loading) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6 flex justify-center items-center h-40">
                    <LoadingSpinner />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>
                    {isSubscribed ? 'Your current subscription details' : 'Subscribe to access premium features'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isSubscribed && subscription ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Status:</span>
                            <span className={`px-2 py-1 rounded text-sm ${subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Start Date:</span>
                            <span>{format(new Date(subscription.startDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">End Date:</span>
                            <span>{format(new Date(subscription.endDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Amount:</span>
                            <span>${(subscription.amount / 100).toFixed(2)}</span>
                        </div>
                        {subscription.paymentMethod && (
                            <div className="flex justify-between">
                                <span className="font-medium">Payment Method:</span>
                                <span>{subscription.paymentMethod}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="mb-4">
                            Subscribe to access premium features including unlimited tutor messaging,
                            priority scheduling, and learning resources.
                        </p>
                        <p className="text-lg font-bold">Starting at $9.99/month</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                {isSubscribed ? (
                    <>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleRenew}>
                            Renew
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleSubscribe}>
                        Subscribe Now
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default SubscriptionCard; 