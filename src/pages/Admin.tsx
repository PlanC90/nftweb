import React from 'react';
import { useStore } from '../store';

export const Admin: React.FC = () => {
  const { orders, cancelOrder, remintNFT, nfts } = useStore();

  const handleCancelOrder = (orderId: string, nftId: string) => {
    cancelOrder(orderId);
    remintNFT(nftId);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">Admin Panel</h2>
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  NFT Title
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const nft = nfts.find((nft) => nft.id === order.nftId);
                return (
                  <tr key={order.id}>
                    <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                      <p className="text-white">{order.id}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                      <p className="text-white">{order.nftTitle}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                      <p className="text-white">{order.customer}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                      <p className="text-white">{order.walletAddress}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                      <p className="text-white">{order.purchaseDate}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                      <p className="text-white">{order.status}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-700 bg-gray-800 text-sm">
                      {order.status !== 'cancelled' && nft ? (
                        <button
                          onClick={() => handleCancelOrder(order.id, nft.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Cancel Order
                        </button>
                      ) : (
                        <span className="text-gray-500">Cancelled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
