import { Link } from "react-router-dom";

const Addresses = () => {
  return (
    <div>
      <p className="text-sm mb-6 text-gray-600">
        The following addresses will be used on the checkout page by default.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* BILLING */}
        <div>
          <h3 className="text-lg mb-2">Billing address</h3>
          <Link
            to="/my-account/edit-address/billing"
            className="text-sm text-[#B8964E] hover:underline"
          >
            Edit
          </Link>

          <div className="mt-4 text-sm leading-6">
            yuvraj mishra <br />
            bihar <br />
            Near Parmani Mandir Choraha, Raja Park <br />
            jaipur 302004 <br />
            Rajasthan
          </div>
        </div>

        {/* SHIPPING */}
        <div>
          <h3 className="text-lg mb-2">Shipping address</h3>
          <Link
            to="/my-account/edit-address/shipping"
            className="text-sm text-[#B8964E] hover:underline"
          >
            Edit
          </Link>

          <div className="mt-4 text-sm leading-6">
            yuvraj mishra <br />
            bihar <br />
            Near Parmani Mandir Choraha, Raja Park <br />
            jaipur 302004 <br />
            Rajasthan
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
