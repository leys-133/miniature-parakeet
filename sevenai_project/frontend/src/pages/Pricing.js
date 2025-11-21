import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlanCard from '../components/PlanCard';

/**
 * Pricing page component.
 *
 * Fetches available subscription plans from the backend and displays
 * them using PlanCard components. Allows the user to select a plan,
 * triggering a subscription request to the backend. Authentication is
 * required for subscribing; errors are shown if not logged in.
 */
function Pricing() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('/api/plans');
        setPlans(res.data.plans);
      } catch (err) {
        setError('لا يمكن تحميل الخطط حاليًا');
      }
    };
    fetchPlans();
  }, []);

  const handleSelect = async (planCode) => {
    try {
      const res = await axios.post('/api/subscribe', { plan_code: planCode });
      setMessage('تم الاشتراك بنجاح');
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء الاشتراك');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-primary">خطط الأسعار</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <PlanCard key={plan.code} plan={plan} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}

export default Pricing;