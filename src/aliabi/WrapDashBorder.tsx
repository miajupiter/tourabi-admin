
export interface WrapDashBorderProps {
  key?: any
  className?: string
  children?: any
}
const WrapDashBorder = ({ key, className, children }: WrapDashBorderProps) => {

  return <>
    <div key={key} className={`rounded-md border border-dashed border-stroke border-opacity-40 p-1 shadow-default dark:border-strokedark ${className}`}>
      {children}
    </div>
  </>
}

export default WrapDashBorder