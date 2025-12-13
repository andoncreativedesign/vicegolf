
import type {FC, ImgHTMLAttributes} from 'react';

interface AedIconProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const AedIcon: FC<AedIconProps> = ({className = '', ...props}) => (
  <img 
    src="/uae-dirham-symbol.svg" 
    alt="UAE Dirham" 
     width="16" 
     height="14"
     className={`inline-block mr-1 align-middle ${className}`}
     aria-hidden="true"
  {...props}
  />
);

export default AedIcon;