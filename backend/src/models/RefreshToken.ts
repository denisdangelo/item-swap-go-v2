export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  is_revoked: boolean;
  created_at: Date;
}

export interface CreateRefreshTokenData {
  user_id: string;
  token: string;
  expires_at: Date;
}
