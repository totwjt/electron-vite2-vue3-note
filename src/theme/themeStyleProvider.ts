import { StyleProvider, Themes } from '@varlet/ui'

import themeVars from "@/theme/themeVars";

export const setGlobalTheme = (theme:'dark'|'light') => {

    const styleVars = themeVars[theme]
    const styleNomal = theme === 'dark' ? 'md3Dark' : 'md3Light'

    // StyleProvider(Themes[styleNomal])
    StyleProvider(styleVars)

}


