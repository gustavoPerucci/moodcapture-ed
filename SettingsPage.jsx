import { useState, useEffect } from 'react'
import { ArrowLeft, Shield, Database, Download, Trash2, Clock, Info, Eye, EyeOff } from 'lucide-react'
import { 
  getPrivacySettings, 
  savePrivacySettings, 
  exportUserData, 
  deleteAllUserData, 
  getDataUsageStats,
  cleanupOldData 
} from '../lib/privacy'

const SettingsPage = ({ onPageChange }) => {
  const [privacySettings, setPrivacySettings] = useState({})
  const [dataStats, setDataStats] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
    loadDataStats()
  }, [])

  const loadSettings = async () => {
    const settings = getPrivacySettings()
    setPrivacySettings(settings)
  }

  const loadDataStats = async () => {
    const stats = getDataUsageStats()
    setDataStats(stats)
  }

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...privacySettings, [key]: value }
    setPrivacySettings(newSettings)
    await savePrivacySettings(newSettings)
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      const userData = exportUserData()
      if (userData) {
        const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `moodcapture-dados-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
    }
    setLoading(false)
  }

  const handleDeleteAllData = async () => {
    setLoading(true)
    try {
      const deletedCount = deleteAllUserData()
      console.log(`${deletedCount} itens deletados`)
      await loadDataStats()
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Erro ao deletar dados:', error)
    }
    setLoading(false)
  }

  const handleCleanupOldData = async () => {
    setLoading(true)
    try {
      const cleanedCount = cleanupOldData()
      console.log(`${cleanedCount} itens antigos removidos`)
      await loadDataStats()
    } catch (error) {
      console.error('Erro na limpeza:', error)
    }
    setLoading(false)
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-12 mb-8">
        <button 
          onClick={() => onPageChange('home')}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Configurações</h1>
        <div className="w-10" />
      </div>

      <div className="space-y-6">
        {/* Privacidade e Segurança */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-foreground">Privacidade e Segurança</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Criptografar dados</p>
                <p className="text-xs text-muted-foreground">Protege suas informações pessoais</p>
              </div>
              <button
                onClick={() => handleSettingChange('encryptData', !privacySettings.encryptData)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.encryptData ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  privacySettings.encryptData ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Anonimizar dados</p>
                <p className="text-xs text-muted-foreground">Remove informações identificáveis</p>
              </div>
              <button
                onClick={() => handleSettingChange('anonymizeData', !privacySettings.anonymizeData)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.anonymizeData ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  privacySettings.anonymizeData ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Limpeza automática</p>
                <p className="text-xs text-muted-foreground">Remove dados antigos automaticamente</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoCleanup', !privacySettings.autoCleanup)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  privacySettings.autoCleanup ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  privacySettings.autoCleanup ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground text-sm">Retenção de dados</p>
                <span className="text-sm text-primary">{privacySettings.dataRetentionDays} dias</span>
              </div>
              <input
                type="range"
                min="7"
                max="365"
                value={privacySettings.dataRetentionDays || 90}
                onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>7 dias</span>
                <span>1 ano</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gerenciamento de Dados */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-5 h-5 text-secondary-foreground" />
            <h3 className="text-lg font-medium text-foreground">Gerenciamento de Dados</h3>
          </div>

          {dataStats && (
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Itens armazenados</p>
                  <p className="font-semibold text-foreground">{dataStats.itemCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Espaço usado</p>
                  <p className="font-semibold text-foreground">{formatBytes(dataStats.totalSize)}</p>
                </div>
                {dataStats.oldestData && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Dados mais antigos</p>
                    <p className="font-semibold text-foreground text-xs">
                      {dataStats.oldestData.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleExportData}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-primary/10 text-primary py-3 px-4 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Meus Dados</span>
            </button>

            <button
              onClick={handleCleanupOldData}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-secondary/10 text-secondary-foreground py-3 px-4 rounded-lg hover:bg-secondary/20 transition-colors disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              <span>Limpar Dados Antigos</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Deletar Todos os Dados</span>
            </button>
          </div>
        </div>

        {/* Informações do App */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 gentle-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Info className="w-5 h-5 text-accent-foreground" />
            <h3 className="text-lg font-medium text-foreground">Sobre o App</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versão</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Funcionalidade offline</span>
              <span className="text-green-600">✓ Ativa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processamento local</span>
              <span className="text-green-600">✓ Ativo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Compartilhamento de dados</span>
              <span className="text-red-600">✗ Desabilitado</span>
            </div>
          </div>
        </div>

        {/* Política de Privacidade */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2">🔒 Seus dados são privados</h4>
          <p className="text-sm text-muted-foreground">
            Todos os seus dados são processados e armazenados localmente no seu dispositivo. 
            Nenhuma informação é enviada para servidores externos. Você tem controle total 
            sobre suas informações pessoais.
          </p>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">Confirmar Exclusão</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Esta ação irá deletar permanentemente todos os seus dados, incluindo histórico 
              emocional e configurações. Esta ação não pode ser desfeita.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAllData}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Deletar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage

