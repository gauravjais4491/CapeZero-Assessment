
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();




interface LoginData {
  delay: number;
  expectedUserName: string;
  email: string;
  password: string
}

export const loginData: LoginData = {
  delay: 300,
  expectedUserName: 'Gaurav',
  email: process.env.EMAIL || '',
  password: process.env.PASSWORD || ''
};
