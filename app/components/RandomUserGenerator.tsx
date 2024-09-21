"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Faker, en } from '@faker-js/faker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserInfo {
  fname: string;
  lname: string;
  gender: 'Female' | 'Male';
  bday: number;
  bmonth: number;
  byear: number;
  dob: string;
  email: string;
  ssn: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  user: string;
  passwd: string;
}

const faker = new Faker({ locale: [en] });

export default function RandomUserGenerator() {
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateUser = () => {
    const firstName = faker.person.firstName(gender.toLowerCase() as 'female' | 'male');
    const lastName = faker.person.lastName();
    const birthdate = faker.date.birthdate({ min: 18, max: 21, mode: 'age' });
    const domains = ["mypostman.site",]
    const randomNumber = faker.number.int({ min: 10, max: 99 });
    const domain = faker.helpers.arrayElement(domains);

    const newUserInfo: UserInfo = {
      fname: firstName,
      lname: lastName,
      gender: gender,
      bday: birthdate.getDate(),
      bmonth: birthdate.getMonth() + 1,
      byear: birthdate.getFullYear(),
      dob: `${birthdate.getMonth() + 1}/${birthdate.getDate().toString().padStart(2, '0')}/${birthdate.getFullYear()}`,
      email: `${firstName}${lastName}${randomNumber}@${domain}`,
      ssn: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
      phone: faker.phone.number({ style: 'international' }).slice(-10),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode('#####'),
      user: `${firstName}${lastName}${randomNumber}`,
      passwd: faker.internet.password({ length: 10 }),
    };

    setUserInfo(newUserInfo);
  };

  const copyToClipboard = () => {
    if (userInfo) {
      navigator.clipboard.writeText(JSON.stringify(userInfo, null, 2))
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  useEffect(() => {
    generateUser();
  }, [gender]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`h-[calc(100vh-72px)] flex justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="p-4 max-w-2xl w-full">
        <div className="">
          <Select value={gender} onValueChange={(value) => setGender(value as 'Female' | 'Male')}>
            <SelectTrigger className={`w-[180px] ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative mt-4">
          <pre className={`min-h-[470px] bg-gray-100 p-4 rounded w-full overflow-x-auto border-2 border-gray-600 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {userInfo ? JSON.stringify(userInfo, null, 2) : ''}
          </pre>
          {userInfo && (
            <div className="flex justify-end">
              <button
                onClick={generateUser}
                className={`absolute top-2 right-14 p-2 rounded text-sm transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              </button>
              <button
                onClick={copyToClipboard}
                className={`absolute top-2 right-2 p-2 rounded text-sm transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-500'}`}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              </button>
            </div>


          )}
        </div>

      </div>
    </div>
  );
}
