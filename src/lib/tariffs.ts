import { supabase } from './supabase'

export type Tariff = {
  id: string
  vehicle_type: string
  stay_type: 'minute' | 'daily' | 'monthly'
  stay_minutes: number | null
  initial_value: number
  additional_hour: number | null
}

const columns = 'id, vehicle_type, stay_type, stay_minutes, initial_value, additional_hour'

export const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatStay(tariff: Tariff) {
  if (tariff.stay_type === 'minute') {
    return `${tariff.stay_minutes} ${tariff.stay_minutes === 1 ? 'minuto' : 'minutos'}`
  }
  return tariff.stay_type === 'daily' ? 'Diária' : 'Mensal'
}

async function companyClient() {
  if (!supabase) throw new Error('A conexão com o banco ainda não foi configurada.')
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) throw new Error('Entre na conta da empresa para acessar as tarifas.')
  return { client: supabase, companyId: session.user.id }
}

export async function loadTariffs(signal: AbortSignal) {
  const { client, companyId } = await companyClient()
  const { data, error } = await client.from('register').select(columns)
    .eq('company_id', companyId).order('vehicle_type').order('stay_type').order('stay_minutes')
    .abortSignal(signal).returns<Tariff[]>()
  if (error) throw new Error('Não foi possível carregar as tarifas. Tente novamente.')
  return data ?? []
}

export async function saveTariff(values: Omit<Tariff, 'id'>) {
  const { client, companyId } = await companyClient()
  const { data, error } = await client.from('register')
    .insert({ ...values, company_id: companyId }).select(columns).single<Tariff>()
  if (error) {
    if (error.code === '23503') throw new Error('Cadastre a empresa vinculada à conta antes de salvar tarifas.')
    if (error.code === '42501') throw new Error('Sua sessão não tem permissão para salvar a tarifa. Entre novamente.')
    throw new Error('Não foi possível salvar a tarifa. Verifique os dados e tente novamente.')
  }
  return data
}
