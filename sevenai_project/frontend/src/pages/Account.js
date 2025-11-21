import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Account page component.
 *
 * Fetches and displays the current user's information, their active
 * subscription and remaining message quota (if applicable). Provides
 * simple placeholders for actions such as upgrading the plan. Requires
 * authentication to access.
 */
function Account() {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
        setPlan(res.data.plan);
        setSubscription(res.data.subscription);
      } catch (err) {
        setError('لا يمكن تحميل بيانات الحساب');
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  if (!user) {
    return <p>جارٍ تحميل بيانات الحساب...</p>;
  }
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">حسابي</h2>
      <p className="mb-2"><strong>الاسم:</strong> {user.name}</p>
      <p className="mb-2"><strong>البريد الإلكتروني:</strong> {user.email}</p>
      {plan && (
        <>
          <p className="mb-2"><strong>الخطة الحالية:</strong> {plan.name}</p>
          {plan.durationMonths ? (
            <p className="mb-2"><strong>تاريخ الانتهاء:</strong> {new Date(subscription.end_at).toLocaleDateString()}</p>
          ) : (
            <p className="mb-2"><strong>المدة:</strong> مدى الحياة</p>
          )}
          {plan.messageLimit ? (
            <p className="mb-2"><strong>حد الرسائل الشهري:</strong> {plan.messageLimit}</p>
          ) : (
            <p className="mb-2"><strong>حد الرسائل:</strong> غير محدود</p>
          )}
        </>
      )}
      <div className="mt-4">
        <button className="bg-primary text-white py-2 px-4 rounded hover:bg-green-800 mr-2">
          تغيير الخطة
        </button>
        <button className="bg-accent text-white py-2 px-4 rounded hover:bg-yellow-700">
          ترقية
        </button>
      </div>
    </div>
  );
}

export default Account;