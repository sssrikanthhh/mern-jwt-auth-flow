export type SigninType = {
  email: string;
  password: string;
  userAgent?: string;
};

export type SignupType = SigninType & {
  confirmPassword: string;
};
