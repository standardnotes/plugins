import { c } from 'ttag'

const DataErrorAlert = () => (
  <div className="auth-overlay">
    <div className="auth-dialog sk-panel">
      <div className="sk-panel-header">
        <div className="sk-panel-header-title">{c('Plugins.Authenticator.Title').t`Invalid Note`}</div>
      </div>
      <div className="sk-panel-content">
        <div className="sk-panel-section sk-panel-hero">
          <div className="sk-panel-row">
            <div className="sk-h1">
              {c('Plugins.Authenticator.Error')
                .t`The note you selected already has existing data that is not valid with this editor. Please clear the note, or select a new one, and try again.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default DataErrorAlert
