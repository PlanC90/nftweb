export interface NFT {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  priceXEP?: number;
  creator: string;
  mintCount: number;
  soldCount: number;
}

export interface User {
  username: string;
  password: string;
}

export interface Order {
  id: string;
  nftTitle: string;
  customer: string;
  walletAddress: string;
  purchaseDate: string;
  status: 'pending payment' | 'shipped' | 'cancelled';
  nftId: string;
}
