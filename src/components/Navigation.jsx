import { Home, BarChart3, Heart, Settings } from 'lucide-react'

const Navigation = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'history', icon: BarChart3, label: 'Histórico' },
    { id: 'resources', icon: Heart, label: 'Recursos' },
    { id: 'settings', icon: Settings, label: 'Configurações' }
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[375px] bg-primary/90 backdrop-blur-md border-t border-primary/20">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white bg-white/20' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation

