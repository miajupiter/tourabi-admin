import { useThemeMode } from "@/hooks/useThemeMode"
const DarkModeSwitcher = () => {
  const { isDarkMode, toDark, toLight, _toogleDarkMode } = useThemeMode()
  return (
    <>
      <button type='button'
        className={`relative h-8 w-8 rounded-full ${isDarkMode ? "bg-yellow-400 text-slate-900" : "bg-slate-900 text-neutral-100"}`}
        onClick={(e) => _toogleDarkMode()}
      >
        {isDarkMode && <i className="fa-solid fa-cloud-sun"></i>}
        {!isDarkMode && <i className="fa-solid fa-moon"></i>}
      </button>
    </>
  )
}

export default DarkModeSwitcher
