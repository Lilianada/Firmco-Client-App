import {
  BanknotesIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCashDeposit } from "../../config/cashTransactions";
import { getUserTerm } from "../../config/terms";
import { getBondsHoldings } from "../../config/bonds";
import { getUserIpos } from "../../config/ipos";
import { getStock } from "../../config/stocks";
import { convertToNumber, formatNumber } from "../../config/utils";
import { setTotalBalance } from "../../store/actions/userActions";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Overview() {
  const userId = useSelector((state) => state.user.userId);
  const [totalBondAmount, setTotalBondAmount] = useState(0);
  const [totalTermAmount, setTotalTermAmount] = useState(0);
  const [totalIpoAmount, setTotalIpoAmount] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [balance, setBalance] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cashDeposits = await getCashDeposit(userId);
        const terms = await getUserTerm(userId);
        const bonds = await getBondsHoldings(userId);
        const ipos = await getUserIpos(userId);
        const stocks = await getStock(userId);

        calculateTotalDeposits(cashDeposits);
        calculateTotalBonds(bonds);
        calculateTotalTerms(terms);
        calculateTotalIpos(ipos);
        calculateTotalShares(stocks);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Calculate total deposits with enhanced error handling
  const calculateTotalDeposits = (deposits) => {
    let total = 0;
    if (Array.isArray(deposits)) {
      deposits.forEach((deposit) => {
        if (deposit && deposit.amount) {
          total += convertToNumber(deposit.amount);
        }
      });
    }
    setTotalDeposits(total);
  };
 

  // Calculate total bonds with enhanced error handling
  const calculateTotalBonds = (bonds) => {
    let total = 0;
    if (Array.isArray(bonds)) {
      bonds.forEach((bond) => {
        if (bond && bond.typeOfRequest && bond.currentValue) {
          const amount = convertToNumber(bond.currentValue);
          const typeOfRequest = bond.typeOfRequest.trim().toUpperCase();
          if (typeOfRequest === "BUY") {
            total += amount;
          } else if (typeOfRequest === "SELL") {
            total -= amount;
          }
        }
      });
    }
    setTotalBondAmount(total);
  };

  // Calculate total terms with enhanced checks and modern JavaScript features
  const calculateTotalTerms = (terms) => {
    let total = 0;
    if (Array.isArray(terms)) {
      terms.forEach((term) => {
        const termType = term?.type?.trim().toUpperCase();
        const principalAmount = convertToNumber(term?.principalAmount);
        if (termType === "DEPOSIT") {
          total += principalAmount;
        } else if (termType === "WITHDRAWAL") {
          total -= principalAmount;
        }
      });
    }
    setTotalTermAmount(total);
  };

  // Calculate total IPOs with enhanced error handling
  const calculateTotalIpos = (ipos) => {
    let total = 0;
    if (Array.isArray(ipos)) {
      ipos.forEach((ipo) => {
        const numberOfShares = convertToNumber(ipo?.numberOfShares);
        const sharePrice = convertToNumber(ipo?.sharePrice);
        const ipoType = ipo?.type?.trim().toUpperCase();
        if (ipoType === "INVEST") {
          total += numberOfShares * sharePrice;
        } else if (ipoType === "SELL") {
          total -= numberOfShares * sharePrice;
        }
      });
    }
    setTotalIpoAmount(total);
  };

  // Calculate total shares with enhanced checks and modern JavaScript features
  const calculateTotalShares = (shares) => {
    let total = 0;
    if (Array.isArray(shares)) {
      shares.forEach((share) => {
        const shareType = share?.type?.trim().toUpperCase();
        const shareValue = convertToNumber(share?.value);
        if (shareType === "BUY") {
          total += shareValue;
        } else if (shareType === "SELL") {
          total -= shareValue;
        }
      });
    }
    setTotalShares(total);
  };

  // Calculate total balance
  useEffect(() => {
    const totalBalance =
      totalDeposits +
      totalBondAmount +
      totalTermAmount +
      totalIpoAmount +
      totalShares;
      setBalance(totalBalance);
      dispatch(setTotalBalance(balance));
    }, [totalDeposits, totalBondAmount, totalTermAmount, totalShares, totalIpoAmount, dispatch, balance]);

  const accounts = [
    {
      name: "Total Balance",
      icons: BanknotesIcon,
      href: "#",
      amount: balance,
      bgColor: "bg-blue-600",
    },
    {
      name: "Cash Balance",
      icons: BanknotesIcon,
      href: "#",
      amount: totalDeposits,
      bgColor: "bg-pink-600",
    },
    {
      name: "Bonds Account",
      icons: DocumentChartBarIcon,
      href: "#",
      amount: totalBondAmount,
      bgColor: "bg-purple-600",
    },
    {
      name: "Term Deposit",
      icons: CreditCardIcon,
      href: "#",
      amount: totalTermAmount,
      bgColor: "bg-yellow-500",
    },
    {
      name: "IPOs Balance",
      icons: CalendarIcon,
      href: "#",
      amount: totalIpoAmount,
      bgColor: "bg-green-500",
    },
    {
      name: "Shares Account",
      icons: ArrowTrendingUpIcon,
      href: "#",
      amount: totalShares,
      bgColor: "bg-blue-500",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Account Overview</h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {accounts.map((item) => (
          <li key={item.name} className="col-span-1 flex rounded-md shadow-sm">
            <div
              className={classNames(
                item.bgColor,
                "flex w-20 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
              )}
            >
              <item.icons className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
              <div className="flex flex-col gap-2 flex-1 truncate px-4 py-3 text-sm">
                <Link
                  to={item.href}
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {item.name}
                </Link>
                <p className="text-gray-500">$ {formatNumber(item.amount)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
