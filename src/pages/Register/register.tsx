import Header from '../../components/Header'
import '../../components/Button.css'
import './register.css'

export default function Register() {
  return (
    <>
      <Header title="Cadastro" />
      <main className="register">
        <div className="register-layout">
        <div className="register-box">
          <h1>Cadastro de veículo</h1>
          <form method="post" onSubmit={(event) => event.preventDefault()}>
            <div className="field">
              <label htmlFor="placa">Placa do veículo</label>
              <input type="text" id="placa" name="placa" required />
            </div>
            <div className="field">
              <label htmlFor="tipo">Veículo</label>
              <select id="tipo" name="tipo" defaultValue="" required>
                <option value="" disabled>Selecione</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="estadia">Estadia</label>
              <select id="estadia" name="estadia" defaultValue="" required>
                <option value="" disabled>Selecione</option>
              </select>
            </div>
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
              <button type="submit" className="btn">Registrar</button>
            </div>
          </form>
        </div>
        <div className="register-secondary-box" />
        </div>
      </main>
    </>
  )
}
