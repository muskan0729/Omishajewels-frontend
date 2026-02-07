const EditBillingAddress = () => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-8">Billing address</h2>

      <form className="space-y-6 max-w-xl">

        {/* Name */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm mb-1 block">First name *</label>
            <input className="wc-input" defaultValue="yuvraj" />
          </div>

          <div>
            <label className="text-sm mb-1 block">Last name *</label>
            <input className="wc-input" defaultValue="mishra" />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="text-sm mb-1 block">Country / Region *</label>
          <input className="wc-input" defaultValue="India" />
        </div>

        {/* Street */}
        <div>
          <label className="text-sm mb-1 block">Street address *</label>
          <input className="wc-input mb-3" defaultValue="bihar" />
          <input
            className="wc-input"
            defaultValue="Near Parmani Mandir Choraha, Raja Park"
          />
        </div>

        {/* City */}
        <div>
          <label className="text-sm mb-1 block">Town / City *</label>
          <input className="wc-input" defaultValue="jaipur" />
        </div>

        {/* State */}
        <div>
          <label className="text-sm mb-1 block">State *</label>
          <input className="wc-input" defaultValue="Rajasthan" />
        </div>

        {/* PIN */}
        <div>
          <label className="text-sm mb-1 block">PIN Code *</label>
          <input className="wc-input" defaultValue="302004" />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm mb-1 block">Phone (optional)</label>
          <input className="wc-input" defaultValue="+918107723060" />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm mb-1 block">Email address *</label>
          <input className="wc-input" defaultValue="intern@spay.live" />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="mt-6 rounded-full bg-[#B8964E] px-10 py-3 text-sm text-white
                     hover:bg-[#a8843f] transition"
        >
          SAVE ADDRESS
        </button>

      </form>
    </div>
  );
};

export default EditBillingAddress;
