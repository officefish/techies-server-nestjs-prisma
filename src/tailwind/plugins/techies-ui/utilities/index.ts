import { globals } from "./globals"
import { styledUtilities } from "./styled"
import { unstyledUtilities } from "./unstyled"

export const injectUtilities = ({addUtilities, variants}:any) :any => {
    addUtilities(globals)
    addUtilities(styledUtilities)
    addUtilities(unstyledUtilities)
}



