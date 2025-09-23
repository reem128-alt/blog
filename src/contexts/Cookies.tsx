import { createContext, PropsWithChildren, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "../hooks/useTranslation";

const Context = createContext({});
export const Cookies = ({ children }: PropsWithChildren) => {
  const [cookies] = useCookies(["i18next"]);
  const { currentLanguage, i18n } = useTranslation();
  useEffect(() => {
    if (cookies.i18next !== currentLanguage) {
      i18n.changeLanguage(cookies.i18next);
    }
  }, []);

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
