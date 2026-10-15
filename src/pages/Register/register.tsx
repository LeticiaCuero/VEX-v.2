import Header from '../../components/Header'
import useRegister from '../../hooks/useRegister'
import { currency, formatStay } from '../../lib/tariffs'
import '../../components/Button.css'
import './register.css'

export default function Register() {
  const {
    vehicleType, registerId, loading, tariffMessage, vehicleTypes, stayOptions,
    handleVehicleChange, handleStayChange, handleRegister,
  } = useRegister()

  return (
    <>
      <Header title="Cadastro" />
      <main className="register">
        <div className="register-layout">
        <div className="register-box">
          <h1>Cadastro de veículo</h1>
          <form method="post" onSubmit={handleRegister}>
            <div className="field">
              <label htmlFor="placa">Placa do veículo</label>
              <input type="text" id="placa" name="placa" required />
            </div>
            <div className="field">
              <label htmlFor="tipo">Veículo</label>
              <select id="tipo" name="vehicle_type" value={vehicleType} disabled={loading || !vehicleTypes.length} onChange={handleVehicleChange} required>
                <option value="" disabled>{loading ? 'Carregando...' : 'Selecione'}</option>
                {vehicleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="estadia">Estadia</label>
              <select id="estadia" name="register_id" value={registerId} disabled={loading || !vehicleType} onChange={handleStayChange} required>
                <option value="" disabled>{vehicleType ? 'Selecione' : 'Selecione o veículo'}</option>
                {stayOptions.map((tariff) => <option key={tariff.id} value={tariff.id}>{formatStay(tariff)} — {currency.format(tariff.initial_value)}</option>)}
              </select>
            </div>
            {tariffMessage && <p className="register-message" role="status">{tariffMessage}</p>}
            <fieldset className="optional-fields">
              <legend>Opcional</legend>
            <div className="field">
              <label htmlFor="modelo">Modelo do veículo</label>
              <input type="text" id="modelo" name="modelo" />
            </div>
            <div className="field">
              <label htmlFor="marca">Marca do veículo</label>
              <input type="text" id="marca" name="marca" />
            </div>
            <div className="field">
              <label htmlFor="cor">Cor do veículo</label>
              <input type="text" id="cor" name="cor" />
            </div>
            <div className="field">
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" name="cpf" autoComplete="off" />
            </div>
            </fieldset>
            <div className="field field--action">
              <button type="submit" className="btn" disabled={loading || !registerId}>Registrar</button>
            </div>
          </form>
        </div>
        <div className="active-history-box">
          <h2>Estadias ativas</h2>
        </div>
        </div>
      </main>
    </>
  )
}
