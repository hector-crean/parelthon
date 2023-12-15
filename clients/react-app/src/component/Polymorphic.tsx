import { ElementType, ReactElement, ReactNode } from "react";



type BoxProps<As extends ElementType, Props = {}> = React.ComponentPropsWithoutRef<As> & Props & {
    as: As;
    children?: ReactNode
}

type BoxComponent = <As extends ElementType, Props >(
    props: BoxProps<As, Props>
) => ReactElement;

const Box: BoxComponent = <As extends ElementType, Props>({ as, children, ...rest }: BoxProps<As, Props>) => {
    const Element: ElementType = as;

    return <Element {...rest}>{children}</Element>;
};




export { Box, type BoxProps };

