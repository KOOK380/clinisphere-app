import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface PriceProps {
  amount: number;
  className?: string;
}

export default function Price({ amount, className = "" }: PriceProps) {
  const { settings } = useSettings();
  
  const formattedAmount = amount.toLocaleString();
  
  if (settings.currencyPosition === 'left') {
    return (
      <span className={className}>
        {settings.currencySymbol}{formattedAmount}
      </span>
    );
  }

  return (
    <span className={className}>
      {formattedAmount} {settings.currencySymbol}
    </span>
  );
}
