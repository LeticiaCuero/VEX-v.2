import Header from '../../components/Header'
import Modal from '../../components/Modal'
import useTariff from '../../hooks/useTariff'
import { currency, formatStay } from '../../lib/tariffs'
import '../../components/Button.css'
import './tariff.css'

export default function Tariff() {
  const {
    newTariffOpen, stayType, tariffs, loading, saving, loadError, saveError, message,
    handleSave, openNewTariff, closeNewTariff, handleStayChange, retryLoad,
  } = useTariff()

  return (
    <>
      <Header title="Tarifa" />
      <main className="tariff">
        <div className="tariff-heading">
          <h1>Tarifas</h1>
          <button className="btn" type="button" onClick={openNewTariff}>Nova tarifa</button>
        </div>

        <Modal open={newTariffOpen} onClose={closeNewTariff} title="Nova tarifa">
        <form className="tariff-form" onSubmit={handleSave} aria-busy={saving}>
          <div className="field">
            <label htmlFor="vehicle-type">Veículo</label>
            <input type="text" name="vehicle-type" id="vehicle-type" placeholder="Ex.: Moto" required />
          </div>
          <div className="field">
            <label htmlFor="stay-type">Tipo de estadia</label>
            <select name="stay-type" id="stay-type" value={stayType} onChange={handleStayChange} required>
              <option value="" disabled>Selecione</option>
              <option value="minute">Minuto</option>
              <option value="daily">Diária</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
          {stayType === 'minute' && (
            <div className="field">
              <label htmlFor="stay-minutes">Quantidade de minutos</label>
              <input type="number" name="stay-minutes" id="stay-minutes" min="1" step="1" placeholder="Ex.: 30" required />
            </div>
          )}
          <div className="field">
            <label htmlFor="initial-value">Valor inicial (R$)</label>
            <input type="number" name="initial-value" id="initial-value" min="0" step="0.01" placeholder="0,00" required />
          </div>
          <div className="field">
            <label htmlFor="additional-hour">Adicional por hora (R$) — opcional</label>
            <input type="number" name="additional-hour" id="additional-hour" min="0" step="0.01" placeholder="0,00" />
          </div>
          {saveError && <p className="tariff-message" role="alert">{saveError}</p>}
          <button className="btn" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </form>
        </Modal>

        <div className="tariff-list">
          <h2>Tarifas cadastradas</h2>
          {message && <p className="tariff-message" role="status">{message}</p>}
          {loading && <p className="tariff-message" role="status">Carregando tarifas...</p>}
          {loadError && <div className="tariff-message" role="alert">
            <p>{loadError}</p>
            <button className="btn" type="button" onClick={retryLoad}>Tentar novamente</button>
          </div>}
          {!loading && !loadError && !tariffs.length && <p className="tariff-message">Nenhuma tarifa cadastrada.</p>}
          {!loadError && tariffs.length > 0 && <ul className="tariff-items">
            {tariffs.map((tariff) => <li key={tariff.id} className="tariff-item">
              <div><h3>{tariff.vehicle_type}</h3><p>{formatStay(tariff)}</p></div>
              <dl>
                <div><dt>Valor inicial</dt><dd>{currency.format(tariff.initial_value)}</dd></div>
                <div><dt>Adicional por hora</dt><dd>{tariff.additional_hour === null ? 'Não definido' : currency.format(tariff.additional_hour)}</dd></div>
              </dl>
            </li>)}
          </ul>}
        </div>
      </main>
    </>
  )
}
