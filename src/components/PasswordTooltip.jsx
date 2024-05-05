import { Popover, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import React, { Fragment, useEffect, useState } from 'react'
import { fetchPasswordPolicySetting } from '../config/utils';

const strongPolicyRequirements = [
    { name: "Minimum of 6 characters" },
    { name: "One uppercase letter" },
    { name: "One lowercase letter" },
    { name: "At least one number" },
    { name: "At least one special character (!@#$%^&*)" },
  ];
  
  const requirements = [
    { name: "No spaces allowed" },
    { name: "Minimum of 6 characters" },
  ];

export default function PasswordTooltip() {
  const [isStrongPasswordPolicy, setIsStrongPasswordPolicy] = useState(true);
  useEffect(() => {
    fetchPasswordPolicySetting()
      .then((isStrong) => {
        setIsStrongPasswordPolicy(isStrong);
      })
      .catch((error) => {
        console.error("Error fetching password policy:", error);
      });
  }, []);


  return (
    <Popover className="relative leading-none">
    <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900">
      <span>
        <QuestionMarkCircleIcon
          className="h-4 w-4 text-blue-600"
          aria-hidden="true"
        />
      </span>
    </Popover.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
      <ul className="w-56 shrink rounded-xl bg-white p-3 text-sm font-medium leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5 text-left">
          { isStrongPasswordPolicy ? (
            strongPolicyRequirements.map((item) => (
              <li
                key={item.name}
                className="block hover:text-blue-600"
              >
                {item.name}
              </li>
            ))) : (
          requirements.map((item) => (
            <li
              key={item.name}
              className="block hover:text-blue-600"
            >
              {item.name}
            </li>
          )))
        }
        </ul>
      </Popover.Panel>
    </Transition>
  </Popover>
  )
}
