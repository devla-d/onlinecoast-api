export interface UserModel {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  next_of_kin: string;

  street_name: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  email: string;
  password: string;
  security_pin: string;
  account_type: string;
  profile_img: any;
}

export interface DesTxtOtherFormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  ben_account_number: string;
  iban_number: string;
  bank_name: string;
  swift_code: string;
  amount: number;
  purpose: string;
}
