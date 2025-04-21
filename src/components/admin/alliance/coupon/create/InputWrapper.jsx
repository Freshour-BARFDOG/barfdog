const InputWrapper = ({ id, label, children }) => {
  return (
    <section className="cont_divider">
      <div className="input_row">
        <div className="title_section fixedHeight">
          <label className="title" htmlFor={id}>
            {label}
          </label>
        </div>
        <div className="inp_section">
          <div className="inp_box">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputWrapper;