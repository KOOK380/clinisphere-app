import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  currencyCode: "MAD",
  currencySymbol: "DH",
  currencyPosition: "right",
  headerLogo:
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/User_font_awesome.svg",
  footerLogo:
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/User_font_awesome.svg",
  logoLink: "/",
  sliderButton1Text: "JOIN NOW",
  sliderButton1Link: "/register",
  sliderButton1Enabled: true,
  sliderButton2Text: "CATALOGUE",
  sliderButton2Link: "/courses",
  sliderButton2Enabled: true,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        // Convert string "1"/"0" to booleans for specific keys
        const formattedData = { ...data };
        [
          "sliderButton1Enabled",
          "sliderButton2Enabled",
        ].forEach((key) => {
          if (formattedData[key] !== undefined) {
            formattedData[key] = formattedData[key] === "1" || formattedData[key] === "true" || formattedData[key] === true;
          }
        });
        setSettings({ ...defaultSettings, ...formattedData });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
