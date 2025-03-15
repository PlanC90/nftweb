import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Need assistance section */}
          <p className="mb-2 text-center">
            Need assistance? 🚀 DM us on X (Twitter) for direct support! 🔒
          </p>

          {/* Legal Disclaimer */}
          <div className="text-center mb-4">
            <h6 className="font-semibold">Legal Disclaimer</h6>
            <p className="text-sm">
              None of the information on this website should be construed as
              providing legal or financial advice. Please note there are always
              risks associated with smart contracts. MemeX is not a registered
              broker, analyst, or investment advisor. If you have purchased
              $MemeX, you agree that you are not purchasing a security or
              investment. The MemeX team cannot be held liable for any losses
              or taxes you may incur. You also agree that the team is
              representing the token as community members and cannot modify the
              contract due to it being renounced. Do conduct your own due
              diligence and consult your financial advisor before making any
              investment decision.
            </p>
          </div>

          {/* Follow us on social media */}
          <div className="mb-4">
            <h6 className="font-semibold">Follow us on social media</h6>
            <div className="flex justify-center space-x-4">
              {/* Social media icons (replace with actual links) */}
              <a href="#" className="hover:text-white">
                🐦
              </a>
              <a href="#" className="hover:text-white">
                ✈️
              </a>
            </div>
          </div>

          {/* Copyright and powered by */}
          <div className="text-center">
            <p className="text-sm">© 2025 MemeX. All rights reserved.</p>
            <p className="text-sm">
              🚀 Powered by Electra Protocol, ensuring the lowest fees, fastest
              transactions, and ultimate security!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
