export default function ModuleHeader(props) {
    return (
      <header className="title-header">
        <div className="header-text">
          <h2>
            Module: <span className="module-header">{props.module}</span>
          </h2>
          <h1>Subtopic: {props.subtopic}</h1>
        </div>
      </header>
    );
  }