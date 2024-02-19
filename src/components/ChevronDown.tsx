
export const ChevronDown = ({ open = false }) => {
  return (<i className={`fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`}></i>)
}

export default ChevronDown