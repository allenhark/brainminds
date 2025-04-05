import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Api from '@/Api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

type PlanOption = {
    id: string;
    name: string;
    price: number;
    months: number;
    features: string[];
    recommended?: boolean;
};

const planOptions: PlanOption[] = [
    {
        id: 'monthly',
        name: '月度计划 Monthly Plan',
        price: 13000, // ¥13,000
        months: 1,
        features: [
            'Access to all tutors',
            'Unlimited messaging',
            'Schedule up to 2 sessions per month',
        ],
    },
    {
        id: 'quarterly',
        name: '季度计划 Quarterly Plan',
        price: 35100, // ¥35,100 (10% discount on monthly)
        months: 3,
        features: [
            'Access to all tutors',
            'Unlimited messaging',
            'Schedule up to 8 sessions per quarter',
            '10% discount compared to monthly plan',
        ],
        recommended: true,
    },
    {
        id: 'annual',
        name: '年度计划 Annual Plan',
        price: 117000, // ¥117,000 (25% discount on monthly)
        months: 12,
        features: [
            'Access to all tutors',
            'Unlimited messaging',
            'Schedule up to 36 sessions per year',
            'Priority scheduling',
            '25% discount compared to monthly plan',
        ],
    },
];

const Subscription: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string>('quarterly');
    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [cardExpiry, setCardExpiry] = useState<string>('');
    const [cardCVC, setCardCVC] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { mode } = useParams<{ mode: string }>();

    const isRenew = mode === 'renew';

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const selectedPlanDetails = planOptions.find(plan => plan.id === selectedPlan);

            if (!selectedPlanDetails) {
                toast.error('Please select a plan');
                setLoading(false);
                return;
            }

            // In a real application, you would handle card processing here
            // using a payment processor like Stripe

            // For now, we'll just simulate a successful payment
            const endpoint = isRenew ? '/api/subscriptions/renew' : '/api/subscriptions/create';

            await Api.post(endpoint, {
                amount: selectedPlanDetails.price,
                months: selectedPlanDetails.months,
                paymentMethod: 'credit_card', // In real app, this would be the token from payment processor
                paymentId: `sim_${Date.now()}`, // In real app, this would be the payment ID from processor
            });

            toast.success(`Subscription ${isRenew ? 'renewed' : 'created'} successfully!`);
            navigate('/study/dashboard');
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        }

        return value;
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }

        return value;
    };

    const handlePlanSelect = (planId: string) => {
        setSelectedPlan(planId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">
                {isRenew ? 'Renew Your Subscription' : 'Choose a Subscription Plan'}
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Select a Plan</h2>

                    <div className="space-y-4">
                        {planOptions.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-lg border p-4 hover:border-primary cursor-pointer ${selectedPlan === plan.id ? 'border-primary bg-primary/5' : ''
                                    }`}
                                onClick={() => handlePlanSelect(plan.id)}
                            >
                                {plan.recommended && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                        Recommended
                                    </span>
                                )}
                                <input
                                    type="radio"
                                    name="plan"
                                    id={plan.id}
                                    value={plan.id}
                                    checked={selectedPlan === plan.id}
                                    onChange={() => handlePlanSelect(plan.id)}
                                    className="absolute top-4 left-4"
                                />
                                <Label htmlFor={plan.id} className="block ml-6 cursor-pointer">
                                    <div className="font-medium text-lg">{plan.name}</div>
                                    <div className="text-2xl font-bold mt-1">
                                        ¥{plan.price.toLocaleString()}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {plan.months === 1 ? '/month' : plan.months === 3 ? '/quarter' : '/year'}
                                        </span>
                                    </div>
                                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <svg
                                                    className="h-4 w-4 mr-2 text-primary"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>Enter your payment information below</CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePaymentSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input
                                        id="card-number"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        required
                                        maxLength={19}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            type="text"
                                            placeholder="MM/YY"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                            required
                                            maxLength={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input
                                            id="cvc"
                                            type="text"
                                            placeholder="123"
                                            value={cardCVC}
                                            onChange={(e) => setCardCVC(e.target.value.replace(/[^0-9]/g, ''))}
                                            required
                                            maxLength={3}
                                        />
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span>
                                            ¥{(planOptions.find(p => p.id === selectedPlan)?.price || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">
                                    {isRenew ? 'Renew Subscription' : 'Complete Purchase'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Subscription; 