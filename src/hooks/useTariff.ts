import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { loadTariffs, saveTariff } from '../lib/tariffs'
import type { Tariff as TariffRow } from '../lib/tariffs'

export default function useTariff() {
  const [newTariffOpen, setNewTariffOpen] = useState(false)
  const [stayType, setStayType] = useState('')
  const [tariffs, setTariffs] = useState<TariffRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [message, setMessage] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    loadTariffs(controller.signal)
      .then((rows) => { if (active) setTariffs(rows) })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar as tarifas.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => {
      active = false
      controller.abort()
    }
  }, [reload])

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const form = event.currentTarget
    const fields = new FormData(form)
    const vehicleType = String(fields.get('vehicle-type') ?? '').trim()
    const initialValue = Number(fields.get('initial-value'))
    const additionalText = String(fields.get('additional-hour') ?? '')
    const additionalHour = additionalText === '' ? null : Number(additionalText)
    const stayMinutes = stayType === 'minute' ? Number(fields.get('stay-minutes')) : null

    if (!vehicleType || !['minute', 'daily', 'monthly'].includes(stayType) ||
        !Number.isFinite(initialValue) || initialValue < 0 || initialValue > 99999999.99 ||
        (additionalHour !== null && (!Number.isFinite(additionalHour) || additionalHour < 0 || additionalHour > 99999999.99)) ||
        (stayType === 'minute' && (stayMinutes === null || !Number.isInteger(stayMinutes) || stayMinutes <= 0 || stayMinutes > 2147483647))) {
      setSaveError('Confira o veículo, o tipo de estadia e os valores informados.')
      return
    }

    setSaving(true)
    setSaveError('')
    setMessage('')
    try {
      const saved = await saveTariff({
        vehicle_type: vehicleType,
        stay_type: stayType as TariffRow['stay_type'],
        stay_minutes: stayMinutes,
        initial_value: initialValue,
        additional_hour: additionalHour,
      })
      setTariffs((current) => [saved, ...current])
      form.reset()
      setStayType('')
      setNewTariffOpen(false)
      setMessage('Tarifa salva com sucesso.')
      setLoading(true)
      setLoadError('')
      setReload((current) => current + 1)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Não foi possível salvar a tarifa.')
    } finally {
      setSaving(false)
    }
  }


  function openNewTariff() {
    setSaveError('')
    setMessage('')
    setNewTariffOpen(true)
  }

  function closeNewTariff() {
    if (!saving) setNewTariffOpen(false)
  }

  function handleStayChange(event: ChangeEvent<HTMLSelectElement>) {
    setStayType(event.target.value)
  }

  function retryLoad() {
    setLoading(true)
    setLoadError('')
    setReload((current) => current + 1)
  }

  return {
    newTariffOpen, stayType, tariffs, loading, saving, loadError, saveError, message,
    handleSave, openNewTariff, closeNewTariff, handleStayChange, retryLoad,
  }
}
