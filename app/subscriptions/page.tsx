"use client";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSubscription } from "@/hooks/useSubscription";
import { SetStateAction, useState } from "react";
import {motion} from "framer-motion"
import { stripePromise } from "@/lib/stripe";
import { CgSpinner } from 'react-icons/cg';
import Link from 'next/link';
import { MdStar } from 'react-icons/md';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
const charities = [
  { emoji: "🫀", name: "Heart Research UK" },
  { emoji: "🌿", name: "Rewilding Britain" },
  { emoji: "🧒", name: "NSPCC" },
  { emoji: "🐋", name: "WWF" },
];

const CheckoutForm=({setOpenCheckout}:{setOpenCheckout:React.Dispatch<SetStateAction<boolean>>})=>{
  const {confirmPayment}=useSubscription()
  const [isLoading,setLoading]=useState(false)
   const router =useRouter()
    const stripe = useStripe();
  const elements = useElements();
  const handleonSubmit=async(e:React.SubmitEvent)=>{
    e.preventDefault()
    setLoading(true)
  if (!stripe || !elements) return;
  try{
  const result = await stripe.confirmPayment({elements,redirect:"if_required"});

  if (result.error) {
    toast.error(result.error.message)
    console.log(result.error.message);
    return;
  }else
  if (result.paymentIntent?.status === "succeeded") {
    await confirmPayment.mutate(result.paymentIntent.id,{onSuccess:()=>{
      toast.success("payment successfull")
      router.push("/dashboard")
    },onError:()=>{
      toast.error("payment failed")
    }})
  }
}finally{
    setOpenCheckout(false)
    setLoading(false)
  }
  }
return (
  <form onSubmit={handleonSubmit} className="space-y-6">
    <PaymentElement />

    <button
      type="submit"
      className="w-full py-3 rounded-lg font-semibold
      bg-gradient-to-r from-[#c49a3a] to-[#e8c96a]
      text-black shadow-md
      hover:opacity-90 active:scale-[0.98]
      transition-all duration-200
      cursor pointer
      flex items-center justify-center gap-2"
    >
      {!isLoading?
      "Pay Now":<CgSpinner className="animate-spin"/>}
    </button>
  </form>
);
}

export default function SubscriptionPlans() {
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  const [charity, setCharity] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const [openCheckout, setOpenCheckout] = useState(false);
  const {createOrder,getPlans}=useSubscription()


  const { data, isLoading, error } =getPlans();
const plans=data?.data
const handleCheckout=(planId:string)=>{
createOrder.mutate(planId,{onSuccess:(v)=>{
  setClientSecret(v.data.clientSecret)
},onError:(e:any)=>{
  if(e?.response?.data.message==='user already has an active subscription'){
    toast.error("Already have Active subcription")
  }
}})
setOpenCheckout(true)
}
  return (
    <main className="min-h-screen bg-white text-gray-900 relative">
   {openCheckout && clientSecret && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">

      {/* Close button */}
      <button
        onClick={() => setOpenCheckout(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-black"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-2 text-center">
        Complete your payment
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Secure payment powered by Stripe
      </p>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#c49a3a",
              colorBackground: "#ffffff",
              colorText: "#1f2937",
              colorDanger: "#ef4444",
              fontFamily: "Inter, sans-serif",
              borderRadius: "10px",
              spacingUnit: "4px",
            },
            rules: {
              ".Input": {
                padding: "12px",
                border: "1px solid #e5e7eb",
              },
              ".Input:focus": {
                border: "1px solid #c49a3a",
                boxShadow: "0 0 0 1px #c49a3a",
              },
            },
          },
        }}
      >
        <CheckoutForm setOpenCheckout={setOpenCheckout}/>
      </Elements>
    </div>
  </div>
)}
      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="text-center mb-14">
          <div className='h-16 '>
                <Link href={"/"}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-[#1a5c42] rounded-lg flex items-center justify-center mr-2"
            >
              <MdStar size={14} className="text-white fill-white" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">Digital</span>
            <span className="text-xl font-bold text-[#1a5c42] ml-1">Heroes</span>
          </motion.div>
          </Link>
          </div>
          <div className="inline-block text-[11px] tracking-[3px] uppercase text-[#c49a3a] mb-5 px-4 py-1 border border-[#c49a3a]/30 rounded-full font-semibold">
            Join the Movement
          </div>

          <h1 className="text-4xl md:text-5xl leading-tight mb-5">
            Play golf.
            <br />
            <em className="text-[#c49a3a]">Give back.</em>
            <br />
            Win prizes.
          </h1>

          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            A portion of every subscription goes directly to the charity you choose.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-100 border border-gray-200 rounded-full p-1">
            {["monthly", "yearly"].map((p) => (
              <button
                key={p}
                onClick={() => setSelected(p as any)}
                className={`px-6 py-2 rounded-full text-sm transition ${
                  selected === p
                    ? "bg-[#c49a3a] text-black font-semibold"
                    : "text-gray-500"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
                {p === "yearly" && (
                  <span className="ml-2 text-[10px] px-2 py-[2px] rounded-full bg-[#c49a3a]/20 text-[#c49a3a] font-bold">
                    Save 26%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          {/* Skeleton */}
          {isLoading &&
            [...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl p-[2px] bg-gray-100 animate-pulse">
                <div className="bg-white rounded-2xl p-8 space-y-4">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-10 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                  <div className="space-y-2 pt-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded" />
                    ))}
                  </div>
                  <div className="h-10 bg-gray-200 rounded mt-6" />
                </div>
              </div>
            ))}

          {/* Error */}
          {!isLoading && error && (
            <div className="col-span-2 text-center text-red-500">
              Failed to load subscription plans. Please try again.
            </div>
          )}

          {/* Data */}
          {!isLoading &&
            !error &&
            plans?.map((plan) => {
              const planKey = plan.planName.toLowerCase() as "monthly" | "yearly";
              const isActive = selected === planKey;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelected(planKey)}
                  className={`rounded-2xl p-[2px] cursor-pointer transition-all hover:scale-[1.02] hover:-translate-y-1 ${
                    isActive
                      ? "bg-white border border-gray-300 shadow-sm"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="bg-white rounded-2xl p-8 h-full relative">

                    {/* Title */}
                    <div className="mb-6">
                      <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                        {plan.planName}
                      </p>

                      <div className="flex items-end gap-2">
                        <span className="text-5xl">
                          {plan.currency === "USD" ? "$" : ""}
                          {plan.price}
                        </span>
                        <span className="text-sm text-gray-400">
                          / {planKey === "monthly" ? "month" : "year"}
                        </span>
                      </div>

                      {/* yearly monthly equivalent */}
                      {planKey === "yearly" && (
                        <p className="text-green-500 text-sm">
                          ≈ £{(plan.price / 12).toFixed(2)} / month
                        </p>
                      )}

                      <p className="text-sm text-gray-500 mt-2">
                        {plan.planDescription}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6 space-y-3">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex gap-2 text-sm text-gray-600">
                          <span className="text-green-500">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                    onClick={()=>{setSelected("monthly");handleCheckout(plan.id)}}
                      className={`w-full py-3 flex gap-4 justify-center rounded-lg font-semibold transition ${
                        isActive
                          ? "bg-gradient-to-r from-[#c49a3a] to-[#e8c96a] text-black shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      Start {plan.planName} {createOrder.isPending?<CgSpinner className='animate-spin'/>:"→"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Charity */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-10">
          <p className="text-xs uppercase tracking-widest text-green-500 mb-2">
            Your Charity Contribution
          </p>

          <h3 className="text-xl mb-2">
            10% of your subscription goes to a cause you care about.
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Pick one now, or choose later.
          </p>

          <div className="flex flex-wrap gap-3">
            {charities.map((c, i) => (
              <button
                key={i}
                onClick={() => setCharity(i)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  charity === i
                    ? "bg-green-100 border border-green-400 text-green-600"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>🔒 Stripe Payments</span>
          <span>✦ Monthly Prize Draw</span>
          <span>🌍 Charity Verified</span>
          <span>↩ Cancel Anytime</span>
        </div>
      </div>
    </main>
  );
}