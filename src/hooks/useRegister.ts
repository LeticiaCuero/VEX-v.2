import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { loadTariffs } from '../lib/tariffs'
import type { Tariff } from '../lib/tariffs'

export default function useRegister() {
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [vehicleType, setVehicleType] = useState('')
  const [registerId, setRegisterId] = useState('')
  const [loading, setLoading] = useState(true)
  const [tariffMessage, setTariffMessage] = useState('')

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    async function fetchTariffs() {
      try {
        const data = await loadTariffs(controller.signal)
        if (active) {
          setTariffs(data ?? [])
          if (!data?.length) setTariffMessage('Cadastre uma tarifa para disponibilizar veículos e estadias.')
        }
      } catch (error) {
        if (active) setTariffMessage(error instanceof Error ? error.message : 'Não foi possível carregar as tarifas.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchTariffs()
    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const vehicleTypes = [...new Set(tariffs.map((tariff) => tariff.vehicle_type))]
  const stayOptions = tariffs.filter((tariff) => tariff.vehicle_type === vehicleType)

  function handleVehicleChange(event: ChangeEvent<HTMLSelectElement>) {
    setVehicleType(event.target.value)
    setRegisterId('')
  }

  function handleStayChange(event: ChangeEvent<HTMLSelectElement>) {
    setRegisterId(event.target.value)
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return {
    vehicleType, registerId, loading, tariffMessage, vehicleTypes, stayOptions,
    handleVehicleChange, handleStayChange, handleRegister,
  }
}
