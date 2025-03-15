import React, { useState, useEffect } from 'react';
import { NFT } from '../types';
import { Link } from 'react-router-dom';

interface NFTCardProps {
  nft: NFT;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [xepPrice, setXepPrice] = useState<number | null>(null);

  useEffect(() => {
    // Mock API call to fetch XEP price
    const fetchXepPrice = async () => {
      try {
        // Replace with actual API endpoint
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=electra-protocol&vs_currencies=usd');
        const data = await response.json();
        setXepPrice(data['electra-protocol'].usd);
      } catch (error) {
        console.error("Failed to fetch XEP price:", error);
        setXepPrice(0.0003);
      }
    };

    fetchXepPrice();
  }, []);

  const calculatedXepPrice = nft.price / 20;

  const formattedXepPrice = calculatedXepPrice.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedMemeXPrice = nft.price.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 hover:scale-105 transition-transform duration-200">
      <div className="h-48 mb-4 overflow-hidden rounded-md flex items-center justify-center">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-contain rounded-md"
          style={{ objectFit: 'contain', transform: 'scale(1.40)' }}
        />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{nft.name}</h3>
      <p className="text-gray-400 mb-2">{nft.description}</p>
      <p className="text-green-500 font-bold text-center">{formattedMemeXPrice} MemeX</p>
      <p className="text-center">OR</p>
      {xepPrice !== null && (
        <p className="text-blue-500 font-bold text-center">{formattedXepPrice} XEP</p>
      )}
      <p className="text-gray-500">{nft.minted}</p>
      <div className="flex justify-center">
        <Link to={`/purchase/${nft.id}`} className="w-full">
          <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Buy NFT
          </button>
        </Link>
      </div>
    </div>
  );
};
