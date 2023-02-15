import "../App.css"

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div onClick={handleClose} className="modal-closebtn">
            <ion-icon name="close-outline"></ion-icon>
        </div>
        {children}
      </section>
    </div>
  );
};

export default Modal;