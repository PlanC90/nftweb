import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store';
import { QRCodeSVG } from 'qrcode.react';

export const Purchase: React.FC = () => {
  const { id } = useParams();
  const { nfts, addOrder, incrementSoldCount, formatPrice } = useStore();
  const [walletAddress, setWalletAddress] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [walletAddressError, setWalletAddressError] = useState('');

  const nft = nfts.find((n) => n.id === id);

  if (!nft) {
    return <div>NFT not found</div>;
  }

  if (nft.soldCount >= nft.mintCount) {
    return <div>This NFT is sold out.</div>;
  }

  const paymentAddress = 'x8SZrSMmxZk4PHdQX3yt3mheYUrzfMvZzv';

  const handleConfirmPayment = () => {
    if (!walletAddress) {
      setWalletAddressError('Wallet address is required.');
      return;
    }

    if (!walletAddress.startsWith('x')) {
      setWalletAddressError('Wallet address must start with "x".');
      return;
    }

    setWalletAddressError('');
    setPaymentConfirmed(true);
    addOrder({
      id: Date.now().toString(),
      nftTitle: nft.title,
      customer: 'Customer Name',
      walletAddress: walletAddress,
      purchaseDate: new Date().toLocaleDateString(),
      nftId: nft.id,
    });
    incrementSoldCount(nft.id);
    alert('Payment confirmed!');
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-gray-800 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img src={nft.image} alt={nft.title} className="w-full rounded-xl" />
              <h2 className="text-3xl font-bold text-white mt-6 mb-4">{nft.title}</h2>
              <p className="text-gray-400 mb-4">{nft.description}</p>
              <div className="mb-6 text-center">
                <p className="text-emerald-400 text-lg font-semibold">{formatPrice(nft.price)} MemeX</p>
                <p className="text-white font-bold">OR</p>
                <p className="text-blue-400 text-lg font-semibold">{formatPrice(nft.priceXEP)} XEP</p>
              </div>
              <p className="text-gray-400 text-center">
                {nft.soldCount}/{nft.mintCount} Minted
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-6">Complete Your Purchase</h3>

              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Your NFT Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="w-full bg-gray-800 text-white p-3 rounded-lg"
                  required
                />
                {walletAddressError && <p className="text-red-500 text-sm mt-1">{walletAddressError}</p>}
                <p className="text-sm text-gray-400 mt-2">The NFT will be transferred to this address after payment</p>
              </div>

              <div className="text-center mb-6">
                <QRCodeSVG value={paymentAddress} size={200} className="mx-auto bg-white p-2 rounded-lg" />
                <p className="text-sm text-gray-400 mt-2">Scan to get payment address</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-400 mb-2">Payment Address:</p>
                <p className="text-white break-all font-mono">{paymentAddress}</p>
              </div>

              <div className="bg-blue-900/50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-200">
                  Important: Send exactly {nft.price} MemeX to the payment address. Your NFT will be transferred to your
                  wallet address after payment confirmation.
                </p>
              </div>

              <button
                onClick={handleConfirmPayment}
                className={`w-full ${
                  paymentConfirmed ? 'bg-gray-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'
                } text-white font-bold py-3 px-6 rounded-lg`}
                disabled={paymentConfirmed}
              >
                {paymentConfirmed ? 'Payment Confirmed' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
