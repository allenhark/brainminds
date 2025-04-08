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
                const response = await Api.get('/subscriptions');
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
            await Api.post('/subscriptions/cancel');
            toast.success('Subscription canceled successfully');

            // Refresh subscription data
            const response = await Api.get('/subscriptions');
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
            <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6 flex justify-center items-center h-40">
                    <LoadingSpinner />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                    <i className="fas fa-credit-card text-red-500 mr-2"></i>
                    订阅状态 Subscription Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isSubscribed && subscription ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">状态 Status:</span>
                            <span className={`px-2 py-1 rounded text-sm ${subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {subscription.status === 'ACTIVE' ? '活跃 Active' : '已取消 Cancelled'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">开始日期 Start Date:</span>
                            <span>{format(new Date(subscription.startDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">结束日期 End Date:</span>
                            <span>{format(new Date(subscription.endDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">金额 Amount:</span>
                            <span>¥{(subscription.amount / 100).toFixed(2)}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-2">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <i className="fas fa-check text-green-500"></i>
                            <span>个性化学习路径 Personalized learning path</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <i className="fas fa-check text-green-500"></i>
                            <span>灵活的时间安排 Flexible scheduling</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <i className="fas fa-check text-green-500"></i>
                            <span>全面的进度跟踪 Comprehensive progress tracking</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <i className="fas fa-check text-green-500"></i>
                            <span>优质学习材料和资源 Premium learning materials</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600 mb-1">¥13,000</p>
                        <p className="text-gray-500 mb-2">per month</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                {isSubscribed ? (
                    <>
                        <Button variant="outline" onClick={handleCancel} className="rounded-full">
                            取消 Cancel
                        </Button>
                        <Button onClick={handleRenew} className="bg-red-500 hover:bg-red-600 text-white rounded-full">
                            续订 Renew
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleSubscribe} className="bg-red-500 hover:bg-red-600 text-white rounded-full">
                        立即订阅 Subscribe Now
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default SubscriptionCard; 