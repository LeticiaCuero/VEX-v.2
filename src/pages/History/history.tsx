import Header from '../../components/Header'
import './history.css'

export default function History() {
  return (
    <>
      <Header title="Histórico" />
      <main className="history-page">
        <div className="history-panel">
          <div className="history-panel-heading">
            <h1 className="history-title">Histórico de estadias</h1>
          </div>
        </div>
      </main>
    </>
  )
}
