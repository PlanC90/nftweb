import React from 'react';
import { Link } from 'react-router-dom';
import { NFT } from '../types';
import { useStore } from '../store';

interface NFTCardProps {
  nft: NFT;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const isSoldOut = nft.soldCount >= nft.mintCount;
  const { formatPrice } = useStore();

  return (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden relative transform transition-transform hover:scale-105 hover:shadow-lg">
      <Link to={`/purchase/${nft.id}`}>
        <img
          src={nft.image}
          alt={nft.title}
          className="w-full h-64 object-cover"
          style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
        />
      </Link>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{nft.title}</h3>
        <p className="text-gray-400 mb-4 h-40 overflow-hidden">{nft.description}</p>
        <p className="text-emerald-400 text-lg font-semibold">{formatPrice(nft.price)} MemeX</p>
        <p className="text-gray-400">
          {nft.soldCount}/{nft.mintCount} Minted
        </p>
        {isSoldOut && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center">
            <span className="text-2xl font-bold text-red-500">Sold Out</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <Link to={`/purchase/${nft.id}`}>
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-bold transition-colors flex items-center justify-center">
            Buy NFT
          </button>
        </Link>
      </div>
    </div>
  );
};
