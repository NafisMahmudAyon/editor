export interface IconProps {
  className?: string;
}


export const HeadingIcon: React.FC<IconProps> = ({className, ...props}) => (
  <svg
    width={21}
    height={24}
    viewBox="0 0 21 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M0 3c0-.83.67-1.5 1.5-1.5H6c.83 0 1.5.67 1.5 1.5S6.83 4.5 6 4.5h-.75v5.25h10.5V4.5H15c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-.75v15h.75c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H15c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5h.75v-6.75H5.25v6.75H6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H1.5C.67 22.5 0 21.83 0 21s.67-1.5 1.5-1.5h.75v-15H1.5C.67 4.5 0 3.83 0 3"
      fill="currentColor"
    />
  </svg>
);

export const DefaultIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
    <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="4" x2="8" y2="12" stroke="currentColor" strokeWidth="2" />
  </svg>
);
