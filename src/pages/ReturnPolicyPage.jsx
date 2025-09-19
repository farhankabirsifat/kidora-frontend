import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ReturnPolicyPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 group"
          aria-label="Go back"
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
  );
}
