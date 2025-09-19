import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, RefreshCcw, ChevronRight, LogOut, BadgeCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/useOrders';
import { useAuth } from '../context/AuthContext';

export default function ReturnPolicyPage() {
  const navigate = useNavigate();
  const { cartItems, wishlistItems } = useCart();
  const { orders } = useOrders();
  const { user, logout } = useAuth();

  const fullName = (user?.firstName || user?.lastName)
    ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    : (user?.email?.split?.('@')?.[0] || 'User');
  const initials = ((user?.firstName?.[0] || user?.email?.[0] || 'U') + '').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100 relative">
            <div className="flex items-center space-x-4 pr-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                {initials}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  {fullName} <BadgeCheck className="w-5 h-5 text-blue-500" />
                </h2>
                <p className="text-sm text-gray-500 break-words">{user?.email}</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <button onClick={()=>navigate('/profile?tab=overview')} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Overview</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>navigate('/profile?tab=account')} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Account Info</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>navigate('/orders')} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Orders ({orders.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>navigate('/wishlist')} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> Wishlist ({wishlistItems.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex w-full items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                <span className="flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Returns Policy</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={async ()=>{ await logout(); navigate('/'); }} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600">
                <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">রিটার্ন ও রিফান্ড নীতি</h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">আপনার কেনা পণ্যে সমস্যা পেলে নিচের সহজ নিয়ম মেনে হাতে পাওয়ার ৭ দিনের ভিতর রিটার্ন করতে পারবেন।</p>
            <div className="space-y-6 text-sm sm:text-base text-gray-700">
              <section>
                <h2 className="font-semibold mb-1">১. সময়সীমা</h2>
                <p>পণ্য হাতে পাওয়ার পর <span className="font-medium">৭ দিনের</span> মধ্যে রিটার্ন অনুরোধ করতে হবে। পণ্য ব্যবহারহীন, ট্যাগ ও আসল প্যাকেট অক্ষত থাকতে হবে।</p>
              </section>
              <section>
                <h2 className="font-semibold mb-1">২. যেগুলো ফেরত নেওয়া হয় না</h2>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Final Sale / Clearance পণ্য</li>
                  <li>ইনারওয়্যার / হাইজিন পণ্য</li>
                  <li>ভুল ব্যবহারে ক্ষতিগ্রস্ত পণ্য</li>
                </ul>
              </section>
              <section>
                <h2 className="font-semibold mb-1">৩. কীভাবে রিটার্ন করবেন</h2>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>
                    WhatsApp এ এই নম্বরে বার্তা পাঠান:
                    <a
                      href="https://wa.me/8801894800865?"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium ml-1"
                    >01894-800865</a>
                  </li>
                  <li>বার্তায় শুধু আপনার Order ID লিখুন (উদাহরণ: #51)</li>
                  <li>প্রয়োজনে সমস্যা/কারণ ও ছবি একসাথে পাঠাতে পারেন</li>
                  <li>আমরা রিপ্লাই করে পরবর্তী ধাপ জানাব</li>
                </ol>
                {/* WhatsApp নম্বর: 01894-800865 (int: +8801894800865) */}
              </section>
              <section>
                <h2 className="font-semibold mb-1">৪. রিফান্ড</h2>
                <p>যাচাই শেষে ৫–১০ কর্মদিবসে আগের পেমেন্ট মাধ্যম বা স্টোর ক্রেডিটে রিফান্ড যাবে।</p>
              </section>
              <section>
                <h2 className="font-semibold mb-1">৫. এক্সচেঞ্জ</h2>
                <p>স্টক থাকলে সাইজ বদল হবে, না থাকলে রিফান্ড / স্টোর ক্রেডিট।</p>
              </section>
              <section>
                <h2 className="font-semibold mb-1">৬. শিপিং</h2>
                <p>ত্রুটিমুক্ত পণ্যের শিপিং ফেরত নয়। ভুল/ডিফেক্ট হলে ফেরত পাওয়া যাবে। প্রয়োজনে রিটার্ন শিপিং খরচ কাটা হতে পারে।</p>
              </section>
              <section>
                <h2 className="font-semibold mb-1">৭. সাহায্য</h2>
                <p>প্রয়োজনে ইমেইল করুন: <a href="mailto:kidorabd@gmail.com" className="text-blue-600 hover:underline">kidorabd@gmail.com</a></p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
