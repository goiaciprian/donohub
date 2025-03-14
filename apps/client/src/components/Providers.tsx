import React from "react";
import { useProvideI18nContext } from "../hooks/useProvideI18nContext"
import { useParams } from "react-router-dom";

export const Providers = ({ children }: { children: React.ReactNode[] | React.ReactNode}) => {
    const { setLang } = useProvideI18nContext();
    const params = useParams();

    React.useEffect(() => {
        setLang(params['lang'])        
    }, [params, setLang]);

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {children}
        </>
    )
}